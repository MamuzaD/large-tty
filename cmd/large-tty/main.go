package main

import (
	"log"

	"github.com/mamuzad/large-tty/internal/server"
)

func main() {
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}
