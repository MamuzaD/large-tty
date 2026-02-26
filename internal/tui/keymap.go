package tui

import (
	"github.com/charmbracelet/bubbles/key"
)

// -- keybindings --

type keyMap struct {
	NextFont key.Binding
	PrevFont key.Binding
	Clear    key.Binding
	Quit     key.Binding
}

func (k keyMap) ShortHelp() []key.Binding {
	return []key.Binding{k.NextFont, k.PrevFont, k.Clear, k.Quit}
}

func (k keyMap) FullHelp() [][]key.Binding {
	return [][]key.Binding{k.ShortHelp()}
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
	Clear: key.NewBinding(
		key.WithKeys("enter"),
		key.WithHelp("enter", "clear"),
	),
	Quit: key.NewBinding(
		key.WithKeys("ctrl+c", "esc"),
		key.WithHelp("esc", "quit"),
	),
}
