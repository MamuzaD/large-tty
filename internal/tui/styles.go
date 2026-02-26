package tui

import (
	"github.com/charmbracelet/lipgloss"
)

// -- colours & styles --

var (
	accent  = lipgloss.Color("204")
	subtle  = lipgloss.Color("241")
	faint   = lipgloss.Color("243")
	primary = lipgloss.Color("168")
	warning = lipgloss.Color("208") // orange
	danger  = lipgloss.Color("9")   // red

	titleStyle = lipgloss.NewStyle().
			Padding(0, 3).
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(accent).
			Foreground(accent).
			Bold(true)

	figStyle = lipgloss.NewStyle().
			Foreground(primary).
			Padding(0, 4)

	fontLabelStyle = lipgloss.NewStyle().
			Foreground(subtle).
			Italic(true)
)

// inputBoxStyle returns the appropriate style based on remaining chars
func inputBoxStyle(remaining int) lipgloss.Style {
	borderColor := lipgloss.Color("63")

	if remaining <= 0 {
		borderColor = danger
	} else if remaining <= 10 {
		borderColor = warning
	}

	return lipgloss.NewStyle().
		BorderStyle(lipgloss.RoundedBorder()).
		BorderForeground(borderColor).
		Padding(0, 1)
}
