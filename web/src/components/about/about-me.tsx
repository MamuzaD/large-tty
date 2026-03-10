import {
  IconWorld,
  IconBrandGithub,
  IconBrandLinkedin,
} from '@tabler/icons-react'

const SOCIALS = [
  { label: 'portfolio', href: 'https://danielmamuza.com', icon: IconWorld },
  {
    label: 'github',
    href: 'https://github.com/mamuzad',
    icon: IconBrandGithub,
  },
  {
    label: 'linkedin',
    href: 'https://linkedin.com/in/daniel-mamuza',
    icon: IconBrandLinkedin,
  },
] as const

export function AboutMe() {
  return (
    <span className="group/d relative inline-block">
      <span className="cursor-default border-b border-dashed border-subtle/40 text-fg transition-colors duration-150 group-hover/d:text-accent group-hover/d:border-accent/60">
        daniel
      </span>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 pb-2 opacity-0 scale-95 origin-bottom transition-all duration-200 ease-out group-hover/d:pointer-events-auto group-hover/d:opacity-100 group-hover/d:scale-100">
        <div className="relative rounded-lg border border-border/20 bg-bg p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-subtle transition-colors duration-100 hover:bg-fg/5 hover:text-fg"
            >
              <Icon size={13} stroke={1.5} className="shrink-0 opacity-60" />
              {label}
            </a>
          ))}
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 size-2.5 rotate-45 border-r border-b border-border/20 bg-bg" />
        </div>
      </div>
    </span>
  )
}
