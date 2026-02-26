package server

import (
	tea "github.com/charmbracelet/bubbletea"
	"github.com/mamuzad/large-tty/internal/tui"
)

func Start() error {
	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "2222"
	// }
	//
	// s, err := wish.NewServer(
	// 	wish.WithAddress(":"+port),
	// 	wish.WithHostKeyPath(".wish_hostkey"),
	// 	wish.WithMiddleware(),
	// )
	// if err != nil {
	// 	log.Fatal(err)
	// }
	//
	// log.Printf("listening on :%s\n", port)
	// log.Fatal(s.ListenAndServe())

	// Local render (no SSH) for now:
	m, opts := tui.BubbleTeaHandler(nil)
	p := tea.NewProgram(m, opts...)
	_, err := p.Run()
	return err
}
