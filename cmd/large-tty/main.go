package main

import (
	"log"

	tea "charm.land/bubbletea/v2"
	"github.com/mamuzad/large-tty/internal/tui"
)

func main() {
	m, opts := tui.BubbleTeaHandler(nil)
	p := tea.NewProgram(m, opts...)
	if _, err := p.Run(); err != nil {
		log.Fatal(err)
	}
}
