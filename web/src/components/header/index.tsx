import { Link, useLocation } from '@tanstack/react-router'
import { SettingsPopup } from './settings'
import { useSettings } from '@/hooks/use-settings'

export function Header() {
  const { theme, monoFont, setTheme, setMonoFont } = useSettings()
  const isHome = useLocation({ select: (l) => l.pathname === '/' })

  return (
    <div className="relative z-50 flex shrink-0 items-center justify-between px-6 pt-5">
      <Link
        to={isHome ? '/about' : '/'}
        className="text-xs text-subtle transition-colors hover:text-accent"
      >
        {isHome ? 'about' : '<- back'}
      </Link>

      <SettingsPopup
        theme={theme}
        monoFont={monoFont}
        onThemeChange={setTheme}
        onFontChange={setMonoFont}
      />
    </div>
  )
}
