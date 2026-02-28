package tui

import (
	"github.com/charmbracelet/bubbles/key"
)

// -- keybindings --

type keyMap struct {
	NextFont   key.Binding
	PrevFont   key.Binding
	RandomFont key.Binding
	PlayRandom key.Binding
	Clear      key.Binding
	Help       key.Binding
	Quit       key.Binding
}

func (k keyMap) ShortHelp() []key.Binding {
	return []key.Binding{k.Help, k.Clear, k.Quit}
}

func (k keyMap) FullHelp() [][]key.Binding {
	return [][]key.Binding{{
		k.NextFont,
		k.PrevFont,
		k.RandomFont,
		k.PlayRandom,
	},
		{
			k.Help,
			k.Clear,
			k.Quit,
		}}
}

var keys = keyMap{
	NextFont: key.NewBinding(
		key.WithKeys("tab"),
		key.WithHelp("tab", "next font"),
	),
	PrevFont: key.NewBinding(
		key.WithKeys("shift+tab"),
		key.WithHelp("shift+tab", "prev font"),
	),
	RandomFont: key.NewBinding(
		key.WithKeys("ctrl+r"),
		key.WithHelp("ctrl+r", "random font"),
	),
	PlayRandom: key.NewBinding(
		key.WithKeys("alt+r"),
		key.WithHelp("alt+r", "play random"),
	),
	Clear: key.NewBinding(
		key.WithKeys("enter"),
		key.WithHelp("enter", "clear"),
	),
	Quit: key.NewBinding(
		key.WithKeys("ctrl+c", "esc"),
		key.WithHelp("esc", "quit"),
	),
	Help: key.NewBinding(
		key.WithKeys("alt+?"),
		key.WithHelp("alt+?", "help"),
	),
}
