FROM golang:1.22.0-alpine3.19

WORKDIR /app

COPY . .

RUN go build -o pii

EXPOSE 8000

CMD ["./pii"]