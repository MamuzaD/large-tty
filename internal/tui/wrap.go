package tui

import (
	"strings"

	figure "github.com/common-nighthawk/go-figure"
)

// -- helpers --

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
