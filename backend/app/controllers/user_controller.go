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

func GetUserFullName(c *fiber.Ctx, client *db.PrismaClient) error {
	// Get the user ID from the URL parameter
	userID := c.Params("userId")

	// Get the user's full name
	firstName, lastName, getErr := queries.GetUserFullName(c, client, userID)
	if getErr != nil {
		fmt.Println("Error getting user full name:", getErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user full name"})
	}

	// Return the user's full name as JSON response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"userId":  userID,
		"firstName": firstName,
		"lastName":	lastName,
	})
}

func ChangeFullName(c *fiber.Ctx, client *db.PrismaClient) error {
	// Parse the request body
	var requestBody types.ChangeFullNameRequest
	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Change the user's full name
	updatedUser, updateErr := queries.ChangeFullName(c, client, requestBody)
	if updateErr != nil {
		fmt.Println("Error changing user full name:", updateErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to change user full name"})
	}

	// Return the updated user as JSON response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully changed full name",
		"user":    updatedUser,
	})
}

func DeleteUser(c *fiber.Ctx, client *db.PrismaClient) error {
	// Get the user ID from the URL parameter
	userID := c.Params("userId")

	// Delete the user
	deletedUser ,deleteErr := queries.DeleteUser(c, client, userID)
	if deleteErr != nil {
		fmt.Println("Error deleting user:", deleteErr)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	// Return success message
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully deleted user",
		"user":    deletedUser,
	})
}