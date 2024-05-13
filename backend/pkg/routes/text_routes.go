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

	route.Post("/createTextWithContent", func(c *fiber.Ctx) error {
		return controllers.CreateTextWithContent(c, client)
	})

	route.Post("/createTextWithTitleAndContent", func(c *fiber.Ctx) error {
		return controllers.CreateTextWithTitleAndContent(c, client)
	})

	route.Get("/getAllTexts/:userId", func(c *fiber.Ctx) error {
		return controllers.GetAllTexts(c, client)
	})

	route.Put("/editTitle", func(c *fiber.Ctx) error {
		return controllers.EditTitle(c, client)
	})

	route.Put("/editContent", func(c *fiber.Ctx) error {
		return controllers.EditContent(c, client)
	})

	route.Put("/editTitleAndContent", func(c *fiber.Ctx) error {
		return controllers.EditTitleAndContent(c, client)
	})

	route.Delete("/deleteText/:textId", func(c *fiber.Ctx) error {
		return controllers.DeleteText(c, client)
	})

	route.Delete("/deleteAllTexts/:userId", func(c *fiber.Ctx) error {
		return controllers.DeleteAllTexts(c, client)
	})
}