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

func CreateTextWithTitleAndContent(c *fiber.Ctx, client *db.PrismaClient, textRequest types.CreateTextWithTitleAndContentRequest) (*db.TextModel, error) {
	createdText, err := client.Text.CreateOne(
		db.Text.User.Link(
			db.User.UserID.Equals(textRequest.UserID),
		),
		db.Text.TextTitle.Set(textRequest.TextTitle),
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

func EditTitle(c *fiber.Ctx, client *db.PrismaClient, textRequest types.EditTitleRequest) (*db.TextModel, error) {
	editedText, err := client.Text.FindUnique(
		db.Text.TextID.Equals(textRequest.TextID),
	).Update(
		db.Text.TextTitle.Set(textRequest.TextTitle),
		db.Text.LastEditedOn.Set(time.Now()),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return editedText, nil
}

func EditContent(c *fiber.Ctx, client *db.PrismaClient, textRequest types.EditContentRequest) (*db.TextModel, error) {
	editedText, err := client.Text.FindUnique(
		db.Text.TextID.Equals(textRequest.TextID),
	).Update(
		db.Text.TextContent.Set(textRequest.TextContent),
		db.Text.LastEditedOn.Set(time.Now()),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return editedText, nil
}

func EditTitleAndContent(c *fiber.Ctx, client *db.PrismaClient, textRequest types.EditTitleAndContentRequest) (*db.TextModel, error) {
	editedText, err := client.Text.FindUnique(
		db.Text.TextID.Equals(textRequest.TextID),
	).Update(
		db.Text.TextTitle.Set(textRequest.TextTitle),
		db.Text.TextContent.Set(textRequest.TextContent),
		db.Text.LastEditedOn.Set(time.Now()),
	).Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return editedText, nil
}

func DeleteText(c *fiber.Ctx, client *db.PrismaClient, textID string) (*db.TextModel, error) {
	deletedText, err := client.Text.FindUnique(
		db.Text.TextID.Equals(textID),
	).Delete().Exec(c.Context())

	if err != nil {
		return nil, err
	}

	return deletedText, nil
}
