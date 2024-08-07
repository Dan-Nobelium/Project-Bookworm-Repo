package handlers

import (
	"net/http"
	"project-bookworm/templates"
	"project-bookworm/templates/pages"

	"github.com/labstack/echo/v4"
)

func AdminHome(ctx echo.Context) error {
	// get login status from context
	loggedIn := ctx.Get("loggedIn").(bool)

	// return the page
	return templates.Render(ctx, http.StatusOK, pages.AdminHome(loggedIn))
}
