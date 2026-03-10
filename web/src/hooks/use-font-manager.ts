import { useCallback, useEffect, useState } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import {
  DEFAULT_FONT_INDEX,
  FONTS,
  isFontLoaded,
  loadFont,
} from '@/lib/figlet-renderer'

const HOTKEY_OPTS = { ignoreInputs: false } as const

export function useFontManager() {
  const [fontIndex, setFontIndex] = useState(DEFAULT_FONT_INDEX)
  const [fontReady, setFontReady] = useState(true)
  const [randomPlay, setRandomPlay] = useState(false)

  const currentFont = FONTS[fontIndex] ?? 'Standard'

  useEffect(() => {
    const font = FONTS[fontIndex]
    if (!font) return
    if (isFontLoaded(font)) {
      setFontReady(true)
      return
    }
    setFontReady(false)
    loadFont(font).then((ok) => {
      if (ok) setFontReady(true)
    })
  }, [fontIndex])

  useEffect(() => {
    if (!randomPlay) return
    const id = setInterval(() => {
      setFontIndex(Math.floor(Math.random() * FONTS.length))
    }, 750)
    return () => clearInterval(id)
  }, [randomPlay])

  const nextFont = useCallback(() => {
    setFontIndex((i) => (i + 1) % FONTS.length)
  }, [])

  const prevFont = useCallback(() => {
    setFontIndex((i) => (i - 1 + FONTS.length) % FONTS.length)
  }, [])

  const randomFont = useCallback(() => {
    setFontIndex(Math.floor(Math.random() * FONTS.length))
  }, [])

  const toggleRandomPlay = useCallback(() => {
    setRandomPlay((p) => !p)
  }, [])

  useHotkey('Tab', nextFont, HOTKEY_OPTS)
  useHotkey('Shift+Tab', prevFont, HOTKEY_OPTS)
  useHotkey('Control+R', randomFont, HOTKEY_OPTS)
  useHotkey('Alt+R', toggleRandomPlay, HOTKEY_OPTS)

  return {
    fontIndex,
    currentFont,
    fontReady,
    randomPlay,
    nextFont,
    prevFont,
    randomFont,
    toggleRandomPlay,
  }
}
