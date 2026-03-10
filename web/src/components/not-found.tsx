import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { FigletTypewriter } from '@/components/figlet-typewriter'

const MESSAGE = '404 Not Found'
const LETTER_MS = 150
const REDIRECT_MS = 3000
const BAR_WIDTH = 40

export function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => navigate({ to: '/' }), REDIRECT_MS)
    const start = performance.now()
    let raf: number
    const tick = () => {
      const next = Math.min((performance.now() - start) / REDIRECT_MS, 1)
      setProgress(next)
      if (next < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [navigate])

  const filled = Math.round(progress * BAR_WIDTH)
  const bar = '[' + '#'.repeat(filled) + '.'.repeat(BAR_WIDTH - filled) + ']'

  return (
    <div
      ref={containerRef}
      className="flex h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-2"
    >
      <FigletTypewriter
        message={MESSAGE}
        containerRef={containerRef}
        letterMs={LETTER_MS}
      />

      <div className="mt-6 flex flex-col items-center gap-1">
        <pre className="whitespace-pre text-sm leading-tight text-subtle">
          {bar}
        </pre>
        <span className="text-sm text-subtle">redirecting…</span>
        <Link
          to="/"
          className="text-sm text-accent underline underline-offset-4 hover:no-underline"
        >
          go home
        </Link>
      </div>
    </div>
  )
}
