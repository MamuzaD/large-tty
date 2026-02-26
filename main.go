package main

import (
	"fmt"
	"os"
)

func main() {
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

	if err := RunBubbleTea(nil); err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}
}
