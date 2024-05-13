package types

type CreateUserRequest struct {
	UserID    string `json:"userId"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email string `json:"email"`
}

type PrismaUserWhereUniqueInput struct {
  ID *int  // Adapt the field type based on your user ID type in Prisma
}