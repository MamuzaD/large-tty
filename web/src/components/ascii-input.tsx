import { useState } from 'react'
import type { RefObject } from 'react'
import { isASCII } from '@/lib/figlet-renderer'

export function AsciiInput({
  inputRef,
  value,
  onValueChange,
  charLimit,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  value: string
  onValueChange: (next: string) => void
  charLimit: number
}) {
  const [asciiError, setAsciiError] = useState<string | null>(null)
  const remaining = charLimit - value.length
  const visibleError = value ? asciiError : null

  let borderClass = 'border-border'
  if (remaining <= 0) borderClass = 'border-red-500'
  else if (remaining <= 10) borderClass = 'border-orange-500'

  return (
    <div className="flex shrink-0 justify-center px-4 pb-2">
      <div
        className={`rounded-lg border ${borderClass} w-full max-w-md px-3 py-1.5 transition-colors duration-150`}
      >
        <div className="flex items-center gap-1 text-sm">
          <span className="select-none text-subtle">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              const next = e.target.value
              if (next.length > charLimit) return
              if (!isASCII(next)) {
                setAsciiError('ASCII only (0-127).')
                return
              }
              setAsciiError(null)
              onValueChange(next)
            }}
            placeholder="start typing"
            maxLength={charLimit}
            spellCheck={false}
            autoComplete="off"
            aria-describedby={visibleError ? 'ascii-error' : undefined}
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-fg outline-none placeholder:text-placeholder"
          />
        </div>
        {/* error */}
        {visibleError && (
          <div id="ascii-error" className="pt-1 text-xs text-orange-400">
            {visibleError}
          </div>
        )}
      </div>
    </div>
  )
}
