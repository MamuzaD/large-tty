import { useCallback, useEffect, useState } from 'react'

function HelpEntry({
  hotkey,
  desc,
  onClick,
}: {
  hotkey: string
  desc: string
  onClick: () => void
}) {
  return (
    <div className="group contents">
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-left text-accent transition-colors group-hover:text-fg"
      >
        {hotkey}
      </button>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-left text-subtle transition-colors group-hover:text-fg"
      >
        {desc}
      </button>
    </div>
  )
}

export function HelpBar({
  onNextFont,
  onPrevFont,
  onRandomFont,
  onToggleRandomPlay,
  onClear,
}: {
  onNextFont: () => void
  onPrevFont: () => void
  onRandomFont: () => void
  onToggleRandomPlay: () => void
  onClear: () => void
}) {
  const [showHelp, setShowHelp] = useState(false)

  const toggleHelp = useCallback(() => {
    setShowHelp((h) => !h)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.altKey &&
        (e.key === '?' ||
          e.key === '\u00BF' ||
          (e.code === 'Slash' && e.shiftKey))
      ) {
        e.preventDefault()
        e.stopPropagation()
        setShowHelp((h) => !h)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [])

  return (
    showHelp ? (
      <div className="px-4 pb-3 pt-2 text-xs">
        <div className="mx-auto flex w-fit gap-x-8">
          <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-0.5">
            <HelpEntry hotkey="tab" desc="next font" onClick={onNextFont} />
            <HelpEntry
              hotkey="shift+tab"
              desc="prev font"
              onClick={onPrevFont}
            />
            <HelpEntry
              hotkey="ctrl+r"
              desc="random font"
              onClick={onRandomFont}
            />
            <HelpEntry
              hotkey="alt+r"
              desc="play random"
              onClick={onToggleRandomPlay}
            />
          </div>
          <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-0.5">
            <HelpEntry hotkey="alt+?" desc="help" onClick={toggleHelp} />
            <HelpEntry hotkey="enter" desc="clear" onClick={onClear} />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center gap-3 px-4 py-1.5 text-xs">
        <button
          type="button"
          onClick={toggleHelp}
          className="cursor-pointer transition-colors hover:text-fg"
        >
          <kbd className="text-accent">alt+?</kbd>{' '}
          <span className="text-subtle">help</span>
        </button>
        <span className="text-faint">&middot;</span>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer transition-colors hover:text-fg"
        >
          <kbd className="text-accent">enter</kbd>{' '}
          <span className="text-subtle">clear</span>
        </button>
      </div>
    )
  )
}
