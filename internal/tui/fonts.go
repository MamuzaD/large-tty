package tui

// string array of fonts, not sure if this is needed
func LoadFonts() []string {
	return []string{
		"standard",
		"slant",
		"big",
		"larry3d",
		"colossal",
		"doom",
		"banner3",
		"block",
		"shadow",
		"starwars",
		"speed",
		"ogre",
		// Compact fallbacks (auto-selected when terminal is narrow)
		"small",
		"smslant",
		"mini",
		"term",
	}
}
