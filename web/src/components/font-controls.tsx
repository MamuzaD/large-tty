export function FontControls({
  fontLabel,
  randomPlay,
}: {
  fontLabel: string
  randomPlay: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2">
      <span className="text-xs italic text-faint">{fontLabel}</span>
      {randomPlay && <span className="text-xs text-accent">random play</span>}
    </div>
  )
}
