package main

import (
	"log"
	"os"
	"project-bookworm/handlers"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func init() {
	// load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Panicf("Failed to load environment variables: %v", err)
	}
}

func main() {
	e := echo.New()

	handlers.InitHandlerRoutes(e)

	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
