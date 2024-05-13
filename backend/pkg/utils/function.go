package utils

import (
	"github.com/jedipw/PIIDataDetector/prisma/db"
)

func ConvertToPointer(texts []db.TextModel) []*db.TextModel {
    pointerTexts := make([]*db.TextModel, len(texts))
    for i := range texts {
        pointerTexts[i] = &texts[i]
    }
    return pointerTexts
}