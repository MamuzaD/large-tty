package server

import (
	"context"
	"log"
	"os"

	"charm.land/wish/v2"
	bt "charm.land/wish/v2/bubbletea"

	"github.com/mamuzad/large-tty/internal/tui"
)

func Start(ctx context.Context) error {
	addr := os.Getenv("LARGE_TTY_ADDR")
	if addr == "" {
		addr = ":2222"
	}

	s, err := wish.NewServer(
		wish.WithAddress(addr),
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

