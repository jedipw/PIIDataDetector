package main

import (
	"os"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the PII Data Detector API.")
	})

	// Use the PORT environment variable or default to 8000
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// Start the Fiber app on the specified port
	err := app.Listen(":" + port)
	if err != nil {
		panic(err)
	}
}
