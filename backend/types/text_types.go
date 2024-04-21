package types

type CreateTextWithTitleRequest struct {
	UserID string `json:"userId"`
	TextTitle string `json:"textTitle"`
}