package main

import (
	"fmt"
	"os"
)

func main() {
	arg := ""

	for i := 1; i < len(os.Args); i++ {
		arg += os.Args[i] + " "
	}

	fmt.Printf("Hello, Мир! %v\n", arg)
}
