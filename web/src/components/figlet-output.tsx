export function FigletOutput({ text }: { text: string }) {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-auto px-2 pb-40">
      <pre className="w-fit max-w-full shrink-0 whitespace-pre text-center text-sm leading-[1.15] text-primary">
        {text}
      </pre>
    </div>
  )
}
