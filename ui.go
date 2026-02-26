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

	// font label
	label := fmt.Sprintf("font: %s", selectedFont)
	if usedFont != selectedFont {
		label += fmt.Sprintf(" → %s (auto-shrunk)", usedFont)
	}
	label += fmt.Sprintf("  (%d/%d)", m.fontIdx+1, len(m.fonts))
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

func (m Model) currentFont() string {
	if len(m.fonts) == 0 {
		return ""
	}
	return m.fonts[m.fontIdx]
}

// fitWidth truncates every line in s so it fits within maxW columns.
func fitWidth(s string, maxW int) string {
	lines := strings.Split(s, "\n")
	for i, line := range lines {
		if len(line) > maxW {
			lines[i] = line[:maxW]
		}
	}
	return strings.Join(lines, "\n")
}

func clamp(v, lo, hi int) int {
	return min(max(v, lo), hi)
}

// -- figlet wrapping --

// fontTiers defines fallback fonts from large → small.
// The first font in the slice that can render the text in ≤ maxLines wins.
var fontTiers = []string{"big", "standard", "small", "mini", "term"}

const maxFigLines = 3

// wrapFiglet splits text into words and greedily packs them into up to
// maxLines FIGlet "rows" (each row is itself multiple terminal lines).
// Returns the composed output and the font that was used.
func wrapFiglet(text, preferredFont string, maxW, maxLines int) (string, string) {
	// Build an ordered list of fonts to try: preferred first, then tiers.
	fonts := []string{preferredFont}
	for _, f := range fontTiers {
		if f != preferredFont {
			fonts = append(fonts, f)
		}
	}

	for _, font := range fonts {
		result, ok := tryWrap(text, font, maxW, maxLines)
		if ok {
			return result, font
		}
	}

	// ultimate fallback: just render with the smallest font, truncated.
	result, _ := tryWrap(text, "term", maxW, maxLines)
	return result, "term"
}

// tryWrap attempts to wrap text into <= maxLines figlet rows that each
// fit within maxW columns. returns (rendered, true) on success.
func tryWrap(text, font string, maxW, maxLines int) (string, bool) {
	full := renderFig(text, font)
	if maxLineWidth(full) <= maxW {
		return full, true
	}

	words := strings.Fields(text)
	if len(words) == 0 {
		return "", true
	}

	var rows []string
	i := 0

	for i < len(words) && len(rows) < maxLines {
		best := findMaxFit(words[i:], " ", font, maxW)

		// Single word too wide — split by characters.
		if best == 0 {
			runes := []rune(words[i])

			// bail early: if even one character is too wide, no point
			if maxLineWidth(renderFig(string(runes[:1]), font)) > maxW {
				return strings.Join(rows, "\n"), false
			}

			ci := 0
			for ci < len(runes) && len(rows) < maxLines {
				n := findMaxRuneFit(runes[ci:], font, maxW)
				if n == 0 {
					n = 1
				}
				chunk := renderFig(string(runes[ci:ci+n]), font)
				rows = append(rows, fitWidth(chunk, maxW))
				ci += n
			}
			if ci < len(runes) {
				return strings.Join(rows, "\n"), false
			}
			i++
			continue
		}

		chunk := renderFig(strings.Join(words[i:i+best], " "), font)
		rows = append(rows, fitWidth(chunk, maxW))
		i += best
	}

	return strings.Join(rows, "\n"), i >= len(words)
}

// findMaxFit binary-searches for the maximum count of items (1..len(items))
// that, when joined by sep and rendered, fit within maxW.
// Returns 0 if even a single item doesn't fit.
func findMaxFit(items []string, sep, font string, maxW int) int {
	lo, hi := 1, len(items)

	// Quick check: does even one item fit?
	if maxLineWidth(renderFig(items[0], font)) > maxW {
		return 0
	}

	// Quick check: do all items fit?
	if maxLineWidth(renderFig(strings.Join(items, sep), font)) <= maxW {
		return len(items)
	}

	best := 1
	for lo <= hi {
		mid := (lo + hi) / 2
		candidate := renderFig(strings.Join(items[:mid], sep), font)
		if maxLineWidth(candidate) <= maxW {
			best = mid
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return best
}

// findMaxRuneFit binary-searches for the maximum number of runes (1..len(runes))
// that render within maxW.
func findMaxRuneFit(runes []rune, font string, maxW int) int {
	lo, hi := 1, len(runes)

	// Quick check: do all remaining runes fit?
	if maxLineWidth(renderFig(string(runes), font)) <= maxW {
		return len(runes)
	}

	best := 1
	for lo <= hi {
		mid := (lo + hi) / 2
		candidate := renderFig(string(runes[:mid]), font)
		if maxLineWidth(candidate) <= maxW {
			best = mid
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return best
}

func renderFig(text, font string) string {
	text = sanitizeASCII(text)
	s := figure.NewFigure(text, font, true).String()
	return strings.TrimRight(s, "\n")
}

// sanitizeASCII strips any non-ASCII characters from the string.
func sanitizeASCII(s string) string {
	var b strings.Builder
	b.Grow(len(s))
	for _, r := range s {
		if r <= 127 {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// maxLineWidth returns the length of the longest line in s.
func maxLineWidth(s string) int {
	max := 0
	for line := range strings.SplitSeq(s, "\n") {
		if len(line) > max {
			max = len(line)
		}
	}
	return max
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
