import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { Header } from '@/components/header'
import { SettingsProvider } from '@/hooks/use-settings'
import { NotFound } from '@/components/not-found'

import appCss from '@/styles.css?url'

const SITE_NAME = 'large-tty'
const SITE_URL = 'https://large-tty.com'
const DEFAULT_DESCRIPTION =
  'Show text in large ASCII art -- like large-type.com, on the web.'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/landing.jpg`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SITE_NAME,
      },
      {
        name: 'description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'theme-color',
        content: 'rgb(13, 13, 20)',
      },
      {
        property: 'og:title',
        content: SITE_NAME,
      },
      {
        property: 'og:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        property: 'og:url',
        content: SITE_URL,
      },
      {
        property: 'og:image',
        content: DEFAULT_OG_IMAGE,
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
        content: 'A large-tty terminal-style preview image.',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: SITE_NAME,
      },
      {
        name: 'twitter:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest',
      },
      {
        rel: 'canonical',
        href: SITE_URL,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootComponent() {
  return (
    <SettingsProvider>
      <Header />
      <Outlet />
    </SettingsProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script src="/theme-init.js" />
      </head>
      <body className="m-0 overflow-hidden bg-bg text-fg font-mono">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
