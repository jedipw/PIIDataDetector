package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/pkg/routes"
	"github.com/jedipw/PIIDataDetector/pkg/utils"
)

func main() {
	app := fiber.New()

	// Connect to PostgreSQL
	client := utils.PostgresConnect()
	defer client.Disconnect()

	// Setup routes
	routes.DefaultRoute(app)
	routes.UserRoutes(app, client)
	routes.TextRoutes(app, client)

	// Start server
	utils.StartServer(app)
}
