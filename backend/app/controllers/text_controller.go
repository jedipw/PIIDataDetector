package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/app/queries"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateTextWithTitle(c *fiber.Ctx, client *db.PrismaClient) error {
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

func CreateTextWithContent(c *fiber.Ctx, client *db.PrismaClient) error {
	var requestBody types.CreateTextWithContentRequest
	
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	createdText, createErr := queries.CreateTextWithContent(c, client, requestBody)
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

func GetAllTexts(c *fiber.Ctx, client *db.PrismaClient) error {
	// Get the user ID from the URL parameter
	userID := c.Params("userId")

	texts, getErr := queries.GetAllTexts(c, client, userID)
	if getErr != nil {
		fmt.Println("Error getting texts:", getErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get texts"})
	}

	// Return the texts as JSON response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"texts": texts,
	})
}

func GetText(c *fiber.Ctx, client *db.PrismaClient) error {
	// Get the user ID from the URL parameter
	textID := c.Params("textId")

	userID, textTitle, textContent, lastEditedOn, getErr := queries.GetText(c, client, textID)
	if getErr != nil {
		fmt.Println("Error getting text:", getErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get text"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"textId": textID,
		"userId": userID,
		"textTitle": textTitle,
		"textContent": textContent,
		"lastEditedOn": lastEditedOn,
	})
}

func EditTitle(c *fiber.Ctx, client *db.PrismaClient) error {
	var requestBody types.EditTitleRequest
	
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	updatedText, updateErr := queries.EditTitle(c, client, requestBody)
	if updateErr != nil {
		fmt.Println("Error updating text title:", updateErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update text title"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully updated text title",
		"text":    updatedText,
	})
}

func EditContent(c *fiber.Ctx, client *db.PrismaClient) error {
	var requestBody types.EditContentRequest
	
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	updatedText, updateErr := queries.EditContent(c, client, requestBody)
	if updateErr != nil {
		fmt.Println("Error updating text content:", updateErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update text content"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully updated text content",
		"text":    updatedText,
	})
}

func DeleteText(c *fiber.Ctx, client *db.PrismaClient) error {
	// Get the text ID from the URL parameter
	textID := c.Params("textId")

	deletedText, deleteErr := queries.DeleteText(c, client, textID)
	if deleteErr != nil {
		fmt.Println("Error deleting text:", deleteErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete text"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully deleted text",
		"text":    deletedText,
	})
}