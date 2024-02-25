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