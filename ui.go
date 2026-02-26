package main

import (
	"fmt"
	"math/rand"
	"strings"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/ssh"
	figure "github.com/common-nighthawk/go-figure"
)

type Model struct {
	width  int
	height int
	ti     textinput.Model
	font   string
}

func NewModel(sess ssh.Session) Model {
	_ = sess

	ti := textinput.New()
	ti.Placeholder = "type here"
	ti.Prompt = "> "
	ti.Focus()
	ti.CharLimit = 200
	ti.Width = 40

	return Model{
		width:  80,
		height: 24,
		ti:     ti,
	}
}

func (m Model) Init() tea.Cmd {
	return textinput.Blink
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height

		w := min(max(m.width-10, 20), 80)
		m.ti.Width = w

	case tea.KeyMsg:
		switch msg.Type {
		case tea.KeyCtrlC, tea.KeyEsc:
			return m, tea.Quit
		case tea.KeyEnter:
			m.ti.SetValue("")
			return m, nil
		}

		fonts := LoadFonts()
		randFont := fonts[rand.Intn(len(fonts))]
		m.font = randFont
	}

	var cmd tea.Cmd
	m.ti, cmd = m.ti.Update(msg)
	return m, cmd
}

func (m Model) View() string {
	w := m.width

	titleStyle := lipgloss.NewStyle().
		Padding(0, 2).
		BorderStyle(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("205")).
		Align(lipgloss.Center)

	center := lipgloss.NewStyle().
		Width(w).
		Align(lipgloss.Center)

	inputStyle := lipgloss.NewStyle().BorderStyle(lipgloss.RoundedBorder()).Inherit(center)

	header := titleStyle.Render("large-tty")
	inputLine := inputStyle.Render(m.ti.View())

	raw := m.ti.Value()
	figText := raw
	if strings.TrimSpace(figText) == "" {
		figText = "large-tty"
	}

	fig := figure.NewFigure(figText, m.font, true).String()
	fig = center.Height(30).Render(fig)

	help := center.Render("Enter clears • Esc quits")

	return lipgloss.JoinVertical(
		lipgloss.Center,
		header,
		help,
		"",
		inputLine,
		"\n\n",
		fig,
		"",
	) + "\n"
}

func RunBubbleTea(sess ssh.Session) error {
	m := NewModel(sess)

	p := tea.NewProgram(m, tea.WithAltScreen(), tea.WithMouseCellMotion())
	if _, err := p.Run(); err != nil {
		fmt.Printf("there's been an error: %v", err)
		return err
	}

	return nil
}
