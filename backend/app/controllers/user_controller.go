package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/queries"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateUser(c *fiber.Ctx, client *db.PrismaClient) error {
	// Parse the request body
	var requestBody types.CreateUserRequest
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Create a new user
	createdUser, createErr := queries.CreateUser(c, client, requestBody)
	if createErr != nil {
		fmt.Println("Error creating user:", createErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Return the created user as JSON response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully created user",
		"user":    createdUser,
	})
}
