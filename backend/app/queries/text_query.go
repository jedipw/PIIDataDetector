package queries

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateTextWithTitle(c *fiber.Ctx, client *db.PrismaClient, textRequest types.CreateTextWithTitleRequest) (*db.TextModel, error) {
	createdText, err := client.Text.CreateOne(
		db.Text.UserID.Set(textRequest.UserID),
		db.Text.TextTitle.Set(textRequest.TextTitle),
		db.Text.TextContent.Set(""),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdText, nil
}