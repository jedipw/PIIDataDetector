package utils

import (
	"fmt"

	"github.com/jedipw/PIIDataDetector/prisma/db"
)

func PostgresConnect() (*db.PrismaClient) {
	client := db.NewClient()
	err := client.Connect()
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
	}
	
	return client
}