import { AboutMe } from './about-me'

export function AboutFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 border-t border-border/20 bg-bg/90 py-4 min-h-15.25 text-center text-xs text-faint">
      built by <AboutMe />, inspired by{' '}
      <a
        href="https://large-type.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-4 transition-colors hover:text-fg"
      >
        large-type.com
      </a>
    </footer>
  )
}
