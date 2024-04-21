package types

type CreateTextWithTitleRequest struct {
	UserID string `json:"userId"`
	TextTitle string `json:"textTitle"`
}

type CreateTextWithContentRequest struct {
	UserID string `json:"userId"`
	TextContent string `json:"textContent"`
}

type EditTitleRequest struct {
	TextID string `json:"textId"`
	TextTitle string `json:"textTitle"`
}

type EditContentRequest struct {
	TextID string `json:"textId"`
	TextContent string `json:"textContent"`
}