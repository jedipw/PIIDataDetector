package utils

import (
	"github.com/jedipw/PIIDataDetector/prisma/db"
)

func ConvertToPointer(texts []db.TextModel) []*db.TextModel {
	pointerTexts := make([]*db.TextModel, len(texts))
	for i, text := range texts {
		pointerTexts[i] = &text
	}
	return pointerTexts
}
