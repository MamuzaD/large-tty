import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

export const MONO_FONTS = [
  'JetBrains Mono',
  'Geist Mono',
  'Fira Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'Space Mono',
  'Inconsolata',
  'Ubuntu Mono',
] as const

export type MonoFont = (typeof MONO_FONTS)[number]

const STORAGE_KEY = 'large-tty-settings'
const MONO_FONT_STACK =
  "ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace"

interface Settings {
  theme: Theme
  monoFont: MonoFont
}

const DEFAULT_SETTINGS: Settings = { theme: 'dark', monoFont: 'JetBrains Mono' }

function load(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        theme: parsed.theme === 'light' || parsed.theme === 'dark'
          ? parsed.theme
          : 'dark',
        monoFont: (MONO_FONTS as readonly string[]).includes(parsed.monoFont)
          ? (parsed.monoFont as MonoFont)
          : 'JetBrains Mono',
      }
    }
  } catch {
    /* noop */
  }
  return DEFAULT_SETTINGS
}

function persist(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* noop */
  }
}

const loaded = new Set<string>(['JetBrains Mono'])

export function loadGoogleFont(font: string) {
  if (typeof document === 'undefined') return
  if (loaded.has(font)) return
  loaded.add(font)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

export function preloadAllFonts() {
  for (const f of MONO_FONTS) loadGoogleFont(f)
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

function applyMonoFont(font: MonoFont) {
  if (typeof document === 'undefined') return
  loadGoogleFont(font)
  document.documentElement.style.setProperty(
    '--font-mono',
    `'${font}', ${MONO_FONT_STACK}`,
  )
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  useEffect(() => {
    applyTheme(settings.theme)
    applyMonoFont(settings.monoFont)
  }, [settings.theme, settings.monoFont])

  const setTheme = useCallback((theme: Theme) => {
    setSettings((prev) => {
      if (prev.theme === theme) return prev
      const next = { ...prev, theme }
      persist(next)
      return next
    })
  }, [])

  const setMonoFont = useCallback((monoFont: MonoFont) => {
    setSettings((prev) => {
      if (prev.monoFont === monoFont) return prev
      const next = { ...prev, monoFont }
      persist(next)
      return next
    })
  }, [])

  return {
    theme: settings.theme,
    monoFont: settings.monoFont,
    setTheme,
    setMonoFont,
  }
}
