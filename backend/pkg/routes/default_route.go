package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/controllers"
)

func DefaultRoute(a *fiber.App) {
   a.Get("/", controllers.Home)
}