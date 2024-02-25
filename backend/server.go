package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/pkg/utils"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the PII Data Detector API.")
	})

	utils.StartServer(app);
}
