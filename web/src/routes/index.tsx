import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import { FONTS, wrapFiglet } from '@/lib/figlet-renderer'
import { AsciiInput } from '@/components/ascii-input'
import { FigletOutput } from '@/components/figlet-output'
import { Footer } from '@/components/footer'
import { useFontManager } from '@/hooks/use-font-manager'
import { useMonospaceColumns } from '@/hooks/use-monospace-columns'

export const Route = createFileRoute('/')({ component: App })

const CHAR_LIMIT = 300
const HOTKEY_OPTS = { ignoreInputs: false } as const

function App() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { columns, measureRef } = useMonospaceColumns({ containerRef })
  const font = useFontManager()

  const clearInput = useCallback(() => setInput(''), [])

  useHotkey('Enter', clearInput, HOTKEY_OPTS)

  // focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const displayText = input.trim() || 'large-tty'
  let figText = ''
  let usedFont = font.currentFont
  if (font.fontReady) {
    const result = wrapFiglet(displayText, font.currentFont, columns)
    figText = result.text
    usedFont = result.usedFont
  }

  let fontLabel = `font: ${font.currentFont.toLowerCase()}`
  if (usedFont !== font.currentFont) {
    fontLabel += ` \u2192 ${usedFont.toLowerCase()} (auto-shrunk)`
  }
  fontLabel += `  (${font.fontIndex + 1}/${FONTS.length})`

  return (
    <div
      ref={containerRef}
      className="flex h-dvh flex-col overflow-hidden bg-bg text-fg"
    >
      <span
        ref={measureRef}
        className="pointer-events-none invisible fixed left-0 top-0 whitespace-pre text-sm leading-tight"
        aria-hidden="true"
      >
        M
      </span>

      {/* title */}
      <div className="flex shrink-0 justify-center pt-5 pb-3">
        <span className="rounded-lg border border-accent px-8 py-1 font-bold text-accent ">
          large-tty
        </span>
      </div>

      <AsciiInput
        inputRef={inputRef}
        value={input}
        onValueChange={setInput}
        charLimit={CHAR_LIMIT}
      />

      <FigletOutput text={figText} />

      <Footer
        fontLabel={fontLabel}
        randomPlay={font.randomPlay}
        onPrevFont={font.prevFont}
        onNextFont={font.nextFont}
        onRandomFont={font.randomFont}
        onToggleRandomPlay={font.toggleRandomPlay}
        onClear={clearInput}
      />
    </div>
  )
}
