# Include variables from the .envrc file
include .envrc

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo "Usage:"
	@sed -n "s/^##//p" ${MAKEFILE_LIST} | column -t -s ":" | sed -e "s/^/ /"

.PHONY: confirm
confirm:
	@printf "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

# ==================================================================================== #
# DEVELOPERS
# ==================================================================================== #

## run/api: run the cmd/api application
.PHONY: run/api
run/api:
	@go run ./cmd/api -db-dsn=${FULLSTACK_DB_DSN}

## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	psql ${FULLSTACK_DB_DSN}

## db/migrations/up: apply all database migrations
.PHONY: db/migrations/up
db/migrations/up: confirm
	@echo "Running up migrations..."
	migrate -path=./migrations -database=${FULLSTACK_DB_DSN} up

## db/migrations/up-no-confirm: apply all database migrations without confirmation
.PHONY: db/migrations/up-no-confirm
db/migrations/up-no-confirm:
	@echo "Running up migrations..."
	migrate -path=./migrations -database=${FULLSTACK_DB_DSN} up
