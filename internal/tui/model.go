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

type model struct {
	width      int
	height     int
	input      textinput.Model
	help       help.Model
	fonts      []string
	fontIndex  int
	randomPlay bool
}

func newModel(sess ssh.Session) model {
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

	fonts := loadFonts()
	startIndex := defaultFontIndex()

	return model{
		width:     80,
		height:    24,
		input:     ti,
		help:      h,
		fonts:     fonts,
		fontIndex: startIndex,
	}
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		m.input.Width = clamp(m.width-10, 20, 60)
		m.help.Width = m.width

	case randomPlayTickMsg:
		if m.randomPlay && len(m.fonts) > 0 {
			m.fontIndex = rand.Intn(len(m.fonts))
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
			m.input.SetValue("")
			return m, nil

		case key.Matches(msg, keys.RandomFont):
			m.fontIndex = rand.Intn(len(m.fonts))
			return m, nil
		case key.Matches(msg, keys.PlayRandom):
			m.randomPlay = !m.randomPlay
			if m.randomPlay {
				// kick off the loop immediately
				return m, randomPlayTickCmd()
			}
			return m, nil
		case key.Matches(msg, keys.NextFont):
			m.fontIndex = (m.fontIndex + 1) % len(m.fonts)
			return m, nil

		case key.Matches(msg, keys.PrevFont):
			m.fontIndex = (m.fontIndex - 1 + len(m.fonts)) % len(m.fonts)
			return m, nil
		}
	}

	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)
	return m, cmd
}

func (m model) View() string {
	width := m.width
	height := m.height

	center := func(s string) string {
		return lipgloss.PlaceHorizontal(width, lipgloss.Center, s)
	}

	// header
	header := center(titleStyle.Render("large-tty"))

	// calculate remaining chars for color feedback
	used := len(m.input.Value())
	remaining := m.input.CharLimit - used
	inputBox := center(inputBoxStyle(remaining).Render(m.input.View()))

	// figlet output
	raw := strings.TrimSpace(m.input.Value())
	display := raw
	if display == "" {
		display = "large-tty"
	}

	selectedFont := m.currentFont()
	fig, usedFont := wrapFiglet(display, selectedFont, width-8, maxFigLines)

	figRendered := center(figStyle.Render(fig))

	// font label
	label := fmt.Sprintf("font: %s", selectedFont)
	if usedFont != selectedFont {
		label += fmt.Sprintf(" → %s (auto-shrunk)", usedFont)
	}
	label += fmt.Sprintf("  (%d/%d)", m.fontIndex+1, len(m.fonts))

	fontLabel := fontLabelStyle.Render(label)
	if m.randomPlay {
		fontLabel += randomPlayStyle.Render(" random play")
	}
	fontLabel = center(fontLabel)
	helpBar := center(m.help.View(keys))

	// fixed top section
	topFixed := lipgloss.JoinVertical(
		lipgloss.Center,
		"",
		header,
		"",
		inputBox,
	)

	// fixed bottom section
	bottomFixed := lipgloss.JoinVertical(
		lipgloss.Center,
		"",
		fontLabel,
		"",
		helpBar,
	)

	// remaining height becomes the "fig area"
	figAreaHeight := height - lipgloss.Height(topFixed) - lipgloss.Height(bottomFixed)
	figAreaHeight = max(0, figAreaHeight)

	// vertically + horizontally center figlet within the fig area
	figArea := lipgloss.Place(
		width,
		figAreaHeight,
		lipgloss.Center,
		lipgloss.Center,
		figRendered,
	)

	// compose final screen
	return lipgloss.JoinVertical(
		lipgloss.Left,
		topFixed,
		figArea,
		bottomFixed,
	)
}
func (m model) currentFont() string {
	if len(m.fonts) == 0 {
		return ""
	}
	return m.fonts[m.fontIndex]
}

func BubbleTeaHandler(sess ssh.Session) (tea.Model, []tea.ProgramOption) {
	m := newModel(sess)
	return m, []tea.ProgramOption{
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	}
}
