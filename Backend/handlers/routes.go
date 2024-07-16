package handlers

import (
	"project-bookworm/auth"

	"github.com/labstack/echo/v4"
)

func InitHandlerRoutes(e *echo.Echo) {
	e.GET("/", AdminHome, auth.Admin)
}
