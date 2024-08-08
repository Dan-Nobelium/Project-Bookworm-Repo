package api

import "github.com/labstack/echo/v4"

func InitApiRoutes(e *echo.Echo) {
	e.POST("/login", Login)
	e.GET("/logout", Logout)
}
