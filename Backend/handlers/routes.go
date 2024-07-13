package handlers

import (
	"net/http"
	"project-bookworm/templates"
	"project-bookworm/templates/pages"

	"github.com/labstack/echo/v4"
)

func TestHandler(ctx echo.Context) error {
	return templates.Render(ctx, http.StatusOK, pages.TestPage("Hello, World!"))
}

func InitHandlerRoutes(e *echo.Echo) {
	e.GET("/", TestHandler)
}
