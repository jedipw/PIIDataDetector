package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/pkg/routes"
	"github.com/jedipw/PIIDataDetector/pkg/utils"
)

func main() {
	app := fiber.New()
   	
	// Setup routes
   	routes.DefaultRoute(app)

	// Start server
	utils.StartServer(app);
}
