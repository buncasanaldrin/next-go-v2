package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("models: record not found")
	ErrEditConflict   = errors.New("models: edit conflict")
)

type Models struct {
	Products ProductModel
	Tokens   TokenModel
	Users    UserModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Products: ProductModel{DB: db},
		Tokens:   TokenModel{DB: db},
		Users:    UserModel{DB: db},
	}
}
