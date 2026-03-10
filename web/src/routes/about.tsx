import { useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FigletTypewriter } from '@/components/figlet-typewriter'
import { TryItCta } from '@/components/about/cta'
import { TechStack } from '@/components/about/stack'
import { AboutFooter } from '@/components/about/footer'

const SITE_URL = 'https://large-tty.com'
const ABOUT_URL = `${SITE_URL}/about`
const ABOUT_TITLE = 'about - large-tty'
const ABOUT_DESCRIPTION =
  'Learn what large-tty is, where it runs, and the stack behind the terminal and web versions.'
const ABOUT_OG_IMAGE = `${SITE_URL}/og/about.jpg`

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      {
        title: ABOUT_TITLE,
      },
      {
        name: 'description',
        content: ABOUT_DESCRIPTION,
      },
      {
        property: 'og:title',
        content: ABOUT_TITLE,
      },
      {
        property: 'og:description',
        content: ABOUT_DESCRIPTION,
      },
      {
        property: 'og:url',
        content: ABOUT_URL,
      },
      {
        property: 'og:image',
        content: ABOUT_OG_IMAGE,
      },
      {
        property: 'og:image:width',
        content: '2400',
      },
      {
        property: 'og:image:height',
        content: '1260',
      },
      {
        property: 'og:image:alt',
        content: 'The large-tty about page social preview image.',
      },
      {
        name: 'twitter:title',
        content: ABOUT_TITLE,
      },
      {
        name: 'twitter:description',
        content: ABOUT_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: ABOUT_OG_IMAGE,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: ABOUT_URL,
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
