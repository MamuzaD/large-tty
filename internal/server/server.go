package server

import (
	"context"
	"log"

	"github.com/charmbracelet/wish"
	bt "github.com/charmbracelet/wish/bubbletea"

	"github.com/mamuzad/large-tty/internal/tui"
)

func Start(ctx context.Context) error {
	s, err := wish.NewServer(
		wish.WithAddress(":2222"),
		wish.WithHostKeyPath(".ssh/id_ed25519"),
		wish.WithMiddleware(
			bt.Middleware(tui.BubbleTeaHandler),
		),
	)
	if err != nil {
		return err
	}

	done := make(chan error, 1)
	go func() {
		log.Printf("SSH server listening on %s", s.Addr)
		done <- s.ListenAndServe()
	}()

	select {
	case err := <-done:
		return err
	case <-ctx.Done():
		log.Println("Shutting down server...")
		return s.Close()
	}
}
