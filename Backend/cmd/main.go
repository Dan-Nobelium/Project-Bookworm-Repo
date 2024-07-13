package main

import (
	"log"
	"os"
	"project-bookworm/database"
	"project-bookworm/handlers"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func init() {
	// load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Panicf("Failed to load environment variables: %v", err)
	}

	// initialise database connection
	database.InitDB()
}

func main() {
	e := echo.New()

	handlers.InitHandlerRoutes(e)

	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
