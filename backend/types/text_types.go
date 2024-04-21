package types

type CreateTextWithTitleRequest struct {
	UserID string `json:"userId"`
	TextTitle string `json:"textTitle"`
}

type CreateTextWithContentRequest struct {
	UserID string `json:"userId"`
	TextContent string `json:"textContent"`
}