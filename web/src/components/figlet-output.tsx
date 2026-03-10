export function FigletOutput({ text }: { text: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2">
      <pre className="whitespace-pre text-center text-sm leading-[1.15] text-primary">
        {text}
      </pre>
    </div>
  )
}
