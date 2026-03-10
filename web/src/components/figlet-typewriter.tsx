import { useEffect, useMemo, useRef, useState } from 'react'
import { wrapFiglet } from '@/lib/figlet-renderer'
import { useMonospaceColumns } from '@/hooks/use-monospace-columns'

interface FigletTypewriterProps {
  message: string
  /** Outer element used for column measurement. If omitted a wrapper div is rendered internally. */
  containerRef?: React.RefObject<HTMLElement | null>
  font?: string
  letterMs?: number
  onComplete?: () => void
  className?: string
}

export function FigletTypewriter({
  message,
  containerRef: externalRef,
  font = 'Standard',
  letterMs = 150,
  onComplete,
  className = 'whitespace-pre text-center text-sm leading-[1.15] text-accent min-h-24',
}: FigletTypewriterProps) {
  const internalRef = useRef<HTMLDivElement>(null)
  const containerRef = externalRef ?? internalRef
  const { columns, measureRef } = useMonospaceColumns({ containerRef })
  const [charCount, setCharCount] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const len = message.length
    if (reduceMotion) {
      onCompleteRef.current?.()
      return
    }
    let i = 0
    let last = 0
    let reset = false
    let raf: number
    const step = (time: number) => {
      if (!reset) {
        setCharCount(0)
        reset = true
      }
      if (!last) last = time
      if (time - last >= letterMs) {
        i = i + 1
        setCharCount(i)
        last = time
      }
      if (i < len) {
        raf = requestAnimationFrame(step)
      } else {
        onCompleteRef.current?.()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [message, letterMs, reduceMotion])

  const figText = useMemo(() => {
    const visibleCount = reduceMotion ? message.length : charCount
    const partial = message.slice(0, visibleCount)
    if (!partial) return ''
    return wrapFiglet(partial, font, columns).text
  }, [charCount, columns, font, message, reduceMotion])

  const content = (
    <>
      <span
        ref={measureRef}
        className="pointer-events-none invisible fixed left-0 top-0 whitespace-pre text-sm leading-tight"
        aria-hidden="true"
      >
        M
      </span>
      <pre className={className}>{figText}</pre>
    </>
  )

  if (externalRef) return content

  return <div ref={internalRef}>{content}</div>
}
