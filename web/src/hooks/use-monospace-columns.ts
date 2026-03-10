import { useLayoutEffect, useRef, useState } from 'react'

export function useMonospaceColumns({
  containerRef,
  minColumns = 20,
  horizontalPaddingPx = 32,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  minColumns?: number
  horizontalPaddingPx?: number
}) {
  const [columns, setColumns] = useState(80)
  const measureRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    function measure() {
      if (!measureRef.current || !containerRef.current) return
      const charW = measureRef.current.getBoundingClientRect().width
      if (charW === 0) return
      const containerW = containerRef.current.getBoundingClientRect().width
      setColumns(
        Math.max(
          minColumns,
          Math.floor((containerW - horizontalPaddingPx) / charW),
        ),
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef, horizontalPaddingPx, minColumns])

  return { columns, measureRef }
}
