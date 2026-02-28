package tui

import (
	"fmt"
	"math/rand"
	"strings"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/ssh"
)

// -- model --

type Model struct {
	width      int
	height     int
	ti         textinput.Model
	help       help.Model
	fonts      []string
	fontIdx    int
	randomPlay bool
}

func NewModel(sess ssh.Session) Model {
	_ = sess

	ti := textinput.New()
	ti.Placeholder = "start typing…"
	ti.Prompt = "> "
	ti.Focus()
	ti.CharLimit = 300
	ti.Width = 40

	h := help.New()
	h.Styles.ShortKey = lipgloss.NewStyle().Foreground(accent)
	h.Styles.ShortDesc = lipgloss.NewStyle().Foreground(subtle)
	h.Styles.ShortSeparator = lipgloss.NewStyle().Foreground(faint)

	fonts := LoadFonts()
	startIdx := 0
	for i, f := range fonts {
		if f == "standard" {
			startIdx = i
			break
		}
	}

	return Model{
		width:   80,
		height:  24,
		ti:      ti,
		help:    h,
		fonts:   fonts,
		fontIdx: startIdx,
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
		m.ti.Width = clamp(m.width-10, 20, 60)
		m.help.Width = m.width

	case randomPlayTickMsg:
		if m.randomPlay && len(m.fonts) > 0 {
			m.fontIdx = rand.Intn(len(m.fonts))
			return m, randomPlayTickCmd()
		}
		return m, nil

	case tea.KeyMsg:
		switch {
		case key.Matches(msg, keys.Help):
			m.help.ShowAll = !m.help.ShowAll
			return m, nil

		case key.Matches(msg, keys.Quit):
			return m, tea.Quit

		case key.Matches(msg, keys.Clear):
			m.ti.SetValue("")
			return m, nil

		case key.Matches(msg, keys.RandomFont):
			m.fontIdx = rand.Intn(len(m.fonts))
			return m, nil
		case key.Matches(msg, keys.PlayRandom):
			m.randomPlay = !m.randomPlay
			if m.randomPlay {
				// kick off the loop immediately
				return m, randomPlayTickCmd()
			}
			return m, nil
		case key.Matches(msg, keys.NextFont):
			m.fontIdx = (m.fontIdx + 1) % len(m.fonts)
			return m, nil

		case key.Matches(msg, keys.PrevFont):
			m.fontIdx = (m.fontIdx - 1 + len(m.fonts)) % len(m.fonts)
			return m, nil
		}
	}

	var cmd tea.Cmd
	m.ti, cmd = m.ti.Update(msg)
	return m, cmd
}

func (m Model) View() string {
	width := m.width
	height := m.height

	center := func(s string) string {
		return lipgloss.PlaceHorizontal(width, lipgloss.Center, s)
	}

	// header
	header := center(titleStyle.Render("large-tty"))

	// calculate remaining chars for color feedback
	used := len(m.ti.Value())
	remaining := m.ti.CharLimit - used
	inputBox := center(inputBoxStyle(remaining).Render(m.ti.View()))

	// figlet output
	raw := strings.TrimSpace(m.ti.Value())
	display := raw
	if display == "" {
		display = "large-tty"
	}

	selectedFont := m.currentFont()
	fig, usedFont := wrapFiglet(display, selectedFont, width-8, maxFigLines)

	figRendered := center(figStyle.Render(fig))

	// compose top bit
	topContent := lipgloss.JoinVertical(
		lipgloss.Center,
		header,
		"",
		inputBox,
		"",
		figRendered,
	)

	// font label
	label := fmt.Sprintf("font: %s", selectedFont)
	if usedFont != selectedFont {
		label += fmt.Sprintf(" → %s (auto-shrunk)", usedFont)
	}
	label += fmt.Sprintf("  (%d/%d)", m.fontIdx+1, len(m.fonts))
	fontLabel := center(fontLabelStyle.Render(label))
	helpBar := center(m.help.View(keys))

	// compose bottom bit
	bottomContent := lipgloss.JoinVertical(
		lipgloss.Center,
		fontLabel,
		"",
		helpBar,
	)

	// compose
	topHeight := height - lipgloss.Height(bottomContent)
	return lipgloss.JoinVertical(
		lipgloss.Left,
		lipgloss.Place(width, topHeight, lipgloss.Center, lipgloss.Center, topContent),
		bottomContent,
	)
}

func (m Model) currentFont() string {
	if len(m.fonts) == 0 {
		return ""
	}
	return m.fonts[m.fontIdx]
}

func BubbleTeaHandler(sess ssh.Session) (tea.Model, []tea.ProgramOption) {
	m := NewModel(sess)
	return m, []tea.ProgramOption{
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	}
}
