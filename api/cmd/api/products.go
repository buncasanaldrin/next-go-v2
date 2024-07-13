package main

import (
	"errors"
	"fmt"
	"net/http"

	"fullstackapi.aldrinbuncasan.dev/internal/data"
	"fullstackapi.aldrinbuncasan.dev/internal/validator"
)

func (app *application) createProductHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string `json:"name"`
		Code string `json:"code"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	product := &data.Product{
		Name: input.Name,
		Code: input.Code,
	}

	v := validator.New()

	if data.ValidateProduct(v, product); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Products.Insert(product)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateCode):
			v.AddError("code", "a product with this code already exists")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/products/%d", product.ID))

	err = app.writeJSON(w, http.StatusCreated, envelope{"product": product}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showProductHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIdParam(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	product, err := app.models.Products.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"product": product}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateProductHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIdParam(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	product, err := app.models.Products.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	var input struct {
		Name *string `json:"name"`
		Code *string `json:"code"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Name != nil {
		product.Name = *input.Name
	}

	if input.Code != nil {
		product.Code = *input.Code
	}

	v := validator.New()

	if data.ValidateProduct(v, product); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Products.Update(product)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"product": product}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteProductHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIdParam(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Products.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "product successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listProductsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string
		Code string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Name = app.readStrings(qs, "name", "")
	input.Code = app.readStrings(qs, "code", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 20, v)

	input.Filters.Sort = app.readStrings(qs, "sort", "id")
	input.Filters.SortSafelist = []string{"id", "name", "code", "-id", "-name", "-code"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	products, metadata, err := app.models.Products.GetAll(input.Name, input.Code, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"products": products, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
