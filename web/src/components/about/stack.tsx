const WEB_STACK = [
  { name: 'React', color: 'text-[#61dafb]' },
  { name: 'TanStack', color: 'text-[#ef4444]' },
  { name: 'Tailwind', color: 'text-[#38bdf8]' },
  { name: 'figlet.js', color: 'text-[#fbbf24]' },
]

const SSH_STACK = [
  { name: 'Go', color: 'text-[#00ADD8]' },
  { name: 'Bubble Tea', color: 'text-[#ff79c6]' },
  { name: 'Lip Gloss', color: 'text-[#d75f87]' },
  { name: 'Wish', color: 'text-[#56c6be]' },
  { name: 'go-figure', color: 'text-[#fbbf24]' },
]

export function TechStack() {
  return (
    <div className="mx-auto mt-10 flex max-w-xl flex-col gap-6 px-6">
      <h2 className="text-center text-xs uppercase tracking-widest text-faint">
        Built With
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <span className="mb-2 block text-center text-[10px] uppercase tracking-wider text-subtle">
            web
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {WEB_STACK.map((s) => (
              <span
                key={s.name}
                className={`rounded-md border border-border/20 px-3 py-1 text-xs ${s.color}`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden sm:block w-px bg-border/20" />
        <div className="flex-1">
          <span className="mb-2 block text-center text-[10px] uppercase tracking-wider text-subtle">
            ssh
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {SSH_STACK.map((s) => (
              <span
                key={s.name}
                className={`rounded-md border border-border/20 px-3 py-1 text-xs ${s.color}`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
