package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"fullstackapi.aldrinbuncasan.dev/internal/validator"
)

type Product struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	Code      string    `json:"code"`
	Version   int32     `json:"version"`
}

type ProductModel struct {
	DB *sql.DB
}

func ValidateProduct(v *validator.Validator, movie *Product) {
	v.Check(movie.Name == "", "name", "must be provided")
	v.Check(len(movie.Name) > 500, "name", "must not be more than 500 bytes long")

	v.Check(movie.Code == "", "code", "must be provided")
	v.Check(len(movie.Code) > 500, "code", "must not be more than 500 bytes long")
}

func (m ProductModel) Insert(product *Product) error {
	query := `
  INSERT INTO products (name, code)
  VALUES ($1, $2)
  RETURNING id, created_at, version`

	args := []any{product.Name, product.Code}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&product.ID, &product.CreatedAt, &product.Version)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "products_code_key"`:
			return ErrDuplicateCode
		default:
			return err
		}
	}

	return nil
}

func (m ProductModel) Get(id int64) (*Product, error) {
	query := `
  SELECT id, created_at, name, code, version
  FROM products
  WHERE id = $1`

	var product Product

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&product.ID,
		&product.CreatedAt,
		&product.Name,
		&product.Code,
		&product.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &product, nil
}

func (m ProductModel) Update(product *Product) error {
	query := `
  UPDATE products
  SET name = $1, code = $2, version = version + 1
  WHERE id = $3 AND version = $4
  RETURNING version`

	args := []any{product.Name, product.Code, product.ID, product.Version}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&product.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func (m ProductModel) Delete(id int64) error {
	query := `
  DELETE FROM products
  WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (m ProductModel) GetAll(name string, code string, filters Filters) ([]*Product, Metadata, error) {
	query := fmt.Sprintf(`
  SELECT count(*) OVER(), id, created_at, name, code, version
  FROM products
  WHERE (to_tsvector('simple', name) @@ plainto_tsquery('simple', $1) OR $1 = '')
  AND (code = $2 OR $2 = '')
  ORDER BY %s %s, id ASC
  LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []any{name, code, filters.limit(), filters.offset()}

	rows, err := m.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	products := []*Product{}

	for rows.Next() {
		var product Product

		err := rows.Scan(
			&totalRecords,
			&product.ID,
			&product.CreatedAt,
			&product.Name,
			&product.Code,
			&product.Version,
		)
		if err != nil {
			return nil, Metadata{}, err
		}

		products = append(products, &product)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return products, metadata, nil
}
