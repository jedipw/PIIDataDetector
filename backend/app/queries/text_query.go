package queries

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
	"errors"
)

func CreateTextWithTitle(c *fiber.Ctx, client *db.PrismaClient, textRequest types.CreateTextWithTitleRequest) (*db.TextModel, error) {
	user, err := client.User.FindUnique(
        db.User.UserID.Equals(textRequest.UserID),
    ).Exec(c.Context())

	if err != nil {
		// Handle user not found error or other potential errors
		return nil, err
	}

	if user == nil {
		// Handle user not found scenario (e.g., return error)
		return nil, errors.New("user not found")
	}
	createdText, err := client.Text.CreateOne(
		db.Text.UserID.Set(user.UserID),
		db.Text.TextTitle.Set(textRequest.TextTitle),
		db.Text.TextContent.Set(""),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdText, nil
}