package api

import (
	"net/http"
	"project-bookworm/auth"

	"github.com/labstack/echo/v4"
)

func Logout(ctx echo.Context) error {
	auth.RevokeSession(ctx)

	return ctx.Redirect(http.StatusSeeOther, "/")
}
