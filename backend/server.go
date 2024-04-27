package main

import (
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/pkg/routes"
	"github.com/jedipw/PIIDataDetector/pkg/utils"
)

func main() {
	app := fiber.New()

	// Define CORS middleware
    app.Use(func(c *fiber.Ctx) error {
        // Allow requests from all origins
        c.Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
        // Allow specific methods
        c.Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
        // Allow specific headers
        c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        // Handle preflight requests
        if c.Method() == "OPTIONS" {
            return c.SendStatus(fiber.StatusNoContent)
        }
        // Proceed to next middleware
        return c.Next()
    })

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
