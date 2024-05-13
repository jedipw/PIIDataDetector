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
		db.User.Email.Set(userRequest.Email),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

func GetUserDetail(c *fiber.Ctx, client *db.PrismaClient, email string) (string, string, string, error) {
	// Use Prisma Client to get the user's full name
	user, err := client.User.FindFirst(
		db.User.Email.Equals(email) ,
	).Exec(c.Context())

	if err != nil {
		return "", "", "", err
	}

	return user.UserID, user.FirstName, user.LastName, nil
}