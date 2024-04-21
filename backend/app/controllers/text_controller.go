package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/queries"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateTextWithTitle (c *fiber.Ctx, client *db.PrismaClient) error {
	var requestBody types.CreateTextWithTitleRequest
	
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	createdText, createErr := queries.CreateTextWithTitle(c, client, requestBody)
		if createErr != nil {
		fmt.Println("Error creating text:", createErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create text"})
	}

	// Return the created text as JSON response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully created text",
		"text":    createdText,
	})
}