import { useCallback, useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'

const TABS = ['https', 'ssh'] as const
type Tab = (typeof TABS)[number]

const VALUES: Record<Tab, string> = {
  https: 'https://large-tty.com',
  ssh: 'ssh large-tty.com',
}

export function TryItCta() {
  const [tab, setTab] = useState<Tab>('https')
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(VALUES[tab]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [tab])

  return (
    <div className="mx-auto mt-8 w-full max-w-md px-6">
      <div className="overflow-hidden rounded-lg border border-border/30 bg-bg">
        <div className="flex border-b border-border/20 text-xs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 cursor-pointer py-2 tracking-wide transition-colors ${
                tab === t
                  ? 'bg-border/10 text-fg'
                  : 'text-faint hover:text-subtle'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative px-5 py-4 text-center">
          <pre className="text-sm text-brand-1 select-all">{VALUES[tab]}</pre>
          <button
            type="button"
            onClick={copy}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1.5 text-faint transition-colors hover:bg-fg/5 hover:text-subtle"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <IconCheck size={14} stroke={1.5} className="text-brand-1" />
            ) : (
              <IconCopy size={14} stroke={1.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
