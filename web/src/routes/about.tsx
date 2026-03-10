import { useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FigletTypewriter } from '@/components/figlet-typewriter'
import { TryItCta } from '@/components/about/cta'
import { TechStack } from '@/components/about/stack'
import { AboutFooter } from '@/components/about/footer'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      {
        title: 'about - large-tty',
      },
    ],
  }),
})

function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="flex h-dvh flex-col justify-center overflow-hidden bg-bg text-fg"
    >
      {/* Figlet header */}
      <div className="shrink-0 px-2 pt-4">
        <FigletTypewriter
          message="about"
          containerRef={containerRef}
          font="Standard"
          letterMs={120}
          className="whitespace-pre text-center text-sm leading-[1.15] text-accent min-h-24"
        />
      </div>

      {/* Divider */}
      <div className="mx-auto my-6 h-px w-32 bg-border/40" />

      {/* Description */}
      <div className="mx-auto max-w-xl px-6">
        <p className="text-center text-sm leading-relaxed text-subtle">
          <span className="text-fg font-bold">large-tty</span> renders your text
          as large ASCII art
          <br />
          like{' '}
          <a
            href="https://large-type.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 transition-colors hover:text-fg"
          >
            large-type.com
          </a>
          , but built for the terminal and the web{' '}
        </p>
      </div>

      <TryItCta />

      <TechStack />

      {/* Source link */}
      <div className="mx-auto mt-10 mb-28 text-center">
        <a
          href="https://github.com/mamuzad/large-tty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-subtle transition-colors hover:text-accent"
        >
          {`view source on github ->`}
        </a>
      </div>

      <AboutFooter />
    </div>
  )
}
