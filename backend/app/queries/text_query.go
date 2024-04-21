package queries

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jedipw/PIIDataDetector/pkg/utils"
	"github.com/jedipw/PIIDataDetector/prisma/db"
	"github.com/jedipw/PIIDataDetector/types"
)

func CreateTextWithTitle(c *fiber.Ctx, client *db.PrismaClient, textRequest types.CreateTextWithTitleRequest) (*db.TextModel, error) {
	createdText, err := client.Text.CreateOne(
		db.Text.User.Link(
			db.User.UserID.Equals(textRequest.UserID),
		),
		db.Text.TextTitle.Set(textRequest.TextTitle),
		db.Text.TextContent.Set(""),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdText, nil
}

func CreateTextWithContent(c *fiber.Ctx, client *db.PrismaClient, textRequest types.CreateTextWithContentRequest) (*db.TextModel, error) {
	createdText, err := client.Text.CreateOne(
		db.Text.User.Link(
			db.User.UserID.Equals(textRequest.UserID),
		),
		db.Text.TextTitle.Set(""),
		db.Text.TextContent.Set(textRequest.TextContent),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return createdText, nil
}

func GetAllTexts(c *fiber.Ctx, client *db.PrismaClient, userID string) ([]*db.TextModel, error) {
	texts, err := client.Text.FindMany(
		db.Text.UserID.Equals(userID),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return utils.ConvertToPointer(texts), nil
}

func GetText(c *fiber.Ctx, client *db.PrismaClient, textID string) (string, string, string, time.Time, error) {
	text, err := client.Text.FindUnique(
		db.Text.TextID.Equals(textID),
	).Exec(c.Context())

	if err != nil {
		return "", "", "", time.Time{}, err
	}

	return text.UserID, text.TextTitle, text.TextContent, text.LastEditedOn, nil
}