package api

import (
	"net/http"
	"project-bookworm/database"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func Login(ctx echo.Context) error {
	// extract email and password from login form
	email := ctx.FormValue("email")
	password := ctx.FormValue("password")

	// get admin login from database
	admin, err := database.DB.Queries.GetAdminLogin(ctx.Request().Context(), email)
	if err != nil {
		// return to change to error handling template in future
		return ctx.String(http.StatusUnauthorized, "Bad Login")
	}

	// compare password to password hash
	if bcrypt.CompareHashAndPassword(admin.PasswordHash, []byte(password)) != nil {
		// return to change to error handling template in future
		return ctx.String(http.StatusUnauthorized, "Bad Login")
	}

	// return to change to a root page redirect in future
	return ctx.String(http.StatusOK, "Good Login")
}
