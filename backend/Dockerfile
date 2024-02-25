FROM golang:1.22.0-alpine3.19

WORKDIR /app

COPY . .

RUN go run github.com/steebchen/prisma-client-go generate

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o pii

USER nobody:nogroup

CMD ["./pii"]