package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/controllers"
	"github.com/jedipw/PIIDataDetector/prisma/db"
)

func UserRoutes(a *fiber.App, client *db.PrismaClient) {
	// Create routes group.
	route := a.Group("/api/user")

	route.Post("/createUser", func(c *fiber.Ctx) error {
		return controllers.CreateUser(c, client)
	})

	route.Get("/:userId", func(c *fiber.Ctx) error {
		return controllers.GetUserFullName(c, client)
	})

	route.Put("/changeFullName", func(c *fiber.Ctx) error {
		return controllers.ChangeFullName(c, client)
	})

	route.Delete("/:userId", func(c *fiber.Ctx) error {
		return controllers.DeleteUser(c, client)
	})
}