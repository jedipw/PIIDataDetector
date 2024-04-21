package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/controllers"
	"github.com/jedipw/PIIDataDetector/prisma/db"
)

func TextRoutes(a *fiber.App, client *db.PrismaClient) {
	// Create routes group.
	route := a.Group("/api/text")

	route.Post("/createTextWithTitle", func(c *fiber.Ctx) error {
		return controllers.CreateTextWithTitle(c, client)
	})
}