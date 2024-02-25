package utils

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func StartServer(a *fiber.App) {
	// Use the PORT environment variable or default to 8000
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// Start the Fiber app on the specified port
	err := a.Listen(":" + port)
	if err != nil {
		panic(err)
	}
}
