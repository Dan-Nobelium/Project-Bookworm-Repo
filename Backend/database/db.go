package database

import (
	"database/sql"
	"log"
	"os"
	"project-bookworm/database/db"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	Conn    *sql.DB
	Queries *db.Queries
}

var DB = &Database{}

func InitDB() {
	conn, err := sql.Open("sqlite3", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("Failed to initialise database: %v", err)
	}

	DB.Conn = conn
	DB.Queries = db.New(DB.Conn)
}
