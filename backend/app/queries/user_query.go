package queries

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateUser(c *fiber.Ctx, client *db.PrismaClient, userRequest types.CreateUserRequest) (*db.UserModel, error) {
	// Use Prisma Client to create a new user
	createdUser, err := client.User.CreateOne(
		db.User.UserID.Set(userRequest.UserID),
		db.User.FirstName.Set(userRequest.FirstName),
		db.User.LastName.Set(userRequest.LastName),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

func GetUserFullName(c *fiber.Ctx, client *db.PrismaClient, userID string) (string, string, error) {
	// Use Prisma Client to get the user's full name
	user, err := client.User.FindUnique(
		db.User.UserID.Equals(userID),
	).Exec(c.Context())

	if err != nil {
		return "", "", err
	}

	return user.FirstName, user.LastName, nil
}

func ChangeFullName(c *fiber.Ctx, client *db.PrismaClient, userRequest types.ChangeFullNameRequest) (*db.UserModel, error) {
	// Use Prisma Client to update the user's full name
	updatedUser, err := client.User.FindUnique(db.User.UserID.Equals(userRequest.UserID)).Update(
		db.User.FirstName.Set(userRequest.FirstName),
		db.User.LastName.Set(userRequest.LastName),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}

func DeleteUser(c *fiber.Ctx, client *db.PrismaClient, userID string) (*db.UserModel ,error) {
	// Use Prisma Client to delete the user
	deletedUser, err := client.User.FindUnique(
		db.User.UserID.Equals(userID),
	).Delete().Exec(c.Context())

	if err != nil {
		return nil ,err
	}

	return deletedUser, nil
}