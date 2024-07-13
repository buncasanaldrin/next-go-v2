# Dockerfile for Go API
FROM golang:1.22.2-alpine

# Install direnv and other dependencies if needed
RUN apk add --no-cache direnv \
    && apk add --no-cache make \
    && apk add --no-cache postgresql-client \
    && apk add --no-cache curl tar

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Download golang-migrate, extract it, and move it to /go/bin
RUN cd /tmp && \
    curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz && \
    mv migrate /go/bin/

# Copy the rest of the application code
COPY . .

# Copy .envrc (if it's in the root directory)
COPY .envrc .envrc

# Allow .envrc file for direnv
RUN direnv allow .

# Build the Go application
RUN direnv exec . go build -o main ./cmd/api

# Expose the port the app runs on
EXPOSE 4000

# Run database migrations and start the application
CMD ["sh", "-c", "\
    direnv exec . make db/migrations/up-no-confirm && \
    direnv exec . make run/api \
"]
