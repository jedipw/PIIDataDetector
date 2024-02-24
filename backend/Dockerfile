FROM golang:1.22.0-alpine3.19

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o pii

USER nobody:nogroup

CMD ["./pii"]