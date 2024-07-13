package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/products", app.requireAuthenticatedUser(app.listProductsHandler))
	router.HandlerFunc(http.MethodPost, "/v1/products", app.requireAuthenticatedUser(app.createProductHandler))
	router.HandlerFunc(http.MethodGet, "/v1/products/:id", app.requireAuthenticatedUser(app.showProductHandler))
	router.HandlerFunc(http.MethodPatch, "/v1/products/:id", app.requireAuthenticatedUser(app.updateProductHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/products/:id", app.requireAuthenticatedUser(app.deleteProductHandler))

	router.HandlerFunc(http.MethodGet, "/v1/me", app.requireAuthenticatedUser(app.showCurrentUser))
	router.HandlerFunc(http.MethodPost, "/v1/users", app.createUserHandler)

	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthenticationTokenHandler)
	router.HandlerFunc(http.MethodDelete, "/v1/tokens/authentication", app.revokeAuthenticationTokenHandler)

	return app.recoverPanic(app.rateLimit(app.authenticate(router)))
}
