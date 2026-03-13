import { useCallback, useEffect, useRef, useState } from 'react'
import { IconAdjustments, IconMoon, IconSun } from '@tabler/icons-react'
import { MONO_FONTS, preloadAllFonts } from '../../hooks/use-settings'
import type { MonoFont, Theme } from '../../hooks/use-settings'

export function SettingsPopup({
  theme,
  monoFont,
  onThemeChange,
  onFontChange,
}: {
  theme: Theme
  monoFont: MonoFont
  onThemeChange: (t: Theme) => void
  onFontChange: (f: MonoFont) => void
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) preloadAllFonts()
      return !prev
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    const onMouse = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('mousedown', onMouse)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('mousedown', onMouse)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`cursor-pointer rounded-md border p-1.5 transition-colors ${
          open
            ? 'border-border/60 text-accent'
            : 'border-transparent text-faint hover:text-subtle hover:bg-fg/10'
        }`}
        title="Settings"
        aria-label="Settings"
      >
        <IconAdjustments size={16} stroke={1.5} />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-1.5 w-56 border border-border/40 bg-bg"
        >
          {/* Theme */}
          <div className="border-b border-border/20 px-3 py-2.5">
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-faint select-none">
              theme
            </div>
            <div className="flex gap-1">
              {[
                { value: 'dark' as const, icon: IconMoon },
                { value: 'light' as const, icon: IconSun },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onThemeChange(value)}
                  className={`cursor-pointer flex-1 rounded px-2 py-1 text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    theme === value
                      ? 'bg-accent/15 text-accent'
                      : 'text-subtle hover:bg-fg/5 hover:text-fg'
                  }`}
                >
                  <Icon size={12} stroke={1.5} />
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="px-3 py-2.5">
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-faint select-none">
              monospace font
            </div>
            <div className="flex max-h-52 flex-col gap-px overflow-y-auto">
              {MONO_FONTS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onFontChange(f)}
                  style={{ fontFamily: `'${f}', monospace` }}
                  className={`cursor-pointer rounded px-2 py-1 text-left text-xs transition-colors ${
                    monoFont === f
                      ? 'bg-accent/15 text-accent'
                      : 'text-subtle hover:bg-fg/5 hover:text-fg'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
