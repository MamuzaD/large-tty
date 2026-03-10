import { FontControls } from './font-controls'
import { HelpBar } from './help-bar'

export function Footer({
  fontLabel,
  randomPlay,
  onPrevFont,
  onNextFont,
  onRandomFont,
  onToggleRandomPlay,
  onClear,
}: {
  fontLabel: string
  randomPlay: boolean
  onPrevFont: () => void
  onNextFont: () => void
  onRandomFont: () => void
  onToggleRandomPlay: () => void
  onClear: () => void
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border/15 bg-bg/80 backdrop-blur-sm">
      <FontControls fontLabel={fontLabel} randomPlay={randomPlay} />
      <HelpBar
        onNextFont={onNextFont}
        onPrevFont={onPrevFont}
        onRandomFont={onRandomFont}
        onToggleRandomPlay={onToggleRandomPlay}
        onClear={onClear}
      />
    </footer>
  )
}
