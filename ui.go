package main

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/ssh"
	figure "github.com/common-nighthawk/go-figure"
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

// -- colours & styles --

var (
	accent  = lipgloss.Color("204")
	subtle  = lipgloss.Color("241")
	faint   = lipgloss.Color("243")
	primary = lipgloss.Color("168")

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

	inputStyle = lipgloss.NewStyle().
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("63")).
			Padding(0, 1)
)

// -- model --

type Model struct {
	width   int
	height  int
	ti      textinput.Model
	help    help.Model
	fonts   []string
	fontIdx int
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

	case tea.KeyMsg:
		switch {
		case key.Matches(msg, keys.Quit):
			return m, tea.Quit

		case key.Matches(msg, keys.Clear):
			m.ti.SetValue("")
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

	center := func(s string) string {
		return lipgloss.PlaceHorizontal(width, lipgloss.Center, s)
	}

	// header
	header := center(titleStyle.Render("large-tty"))
	helpBar := center(m.help.View(keys))
	inputBox := center(inputStyle.Render(m.ti.View()))

	// figlet output
	raw := strings.TrimSpace(m.ti.Value())
	display := raw
	if display == "" {
		display = "large-tty"
	}

	selectedFont := m.currentFont()
	fig := figure.NewFigure(display, selectedFont, true).String()
	fig = strings.TrimRight(fig, "\n")
	figRendered := center(figStyle.Render(fig))

	// font label
	label := fmt.Sprintf(
		"font: %s  (%d/%d)",
		selectedFont, m.fontIdx+1, len(m.fonts),
	)
	fontLabel := center(fontLabelStyle.Render(label))

	// compose
	content := lipgloss.JoinVertical(
		lipgloss.Center,
		header,
		"",
		helpBar,
		"",
		inputBox,
		"",
		figRendered,
		"",
		fontLabel,
	)

	return lipgloss.Place(
		width, m.height,
		lipgloss.Center, lipgloss.Center,
		content,
	)
}

// -- helpers --

func (m Model) currentFont() string {
	if len(m.fonts) == 0 {
		return ""
	}
	return m.fonts[m.fontIdx]
}

func clamp(v, lo, hi int) int {
	return min(max(v, lo), hi)
}

// -- entry point --

func RunBubbleTea(sess ssh.Session) error {
	m := NewModel(sess)

	opts := []tea.ProgramOption{
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	}

	p := tea.NewProgram(m, opts...)
	if _, err := p.Run(); err != nil {
		fmt.Printf("there's been an error: %v", err)
		return err
	}

	return nil
}
