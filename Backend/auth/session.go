package auth

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"project-bookworm/database"
	"project-bookworm/database/db"
	"time"

	"github.com/labstack/echo/v4"
)

// creates and attaches a session cookie and stores session in database
func CreateSession(ctx echo.Context, admin *db.GetAdminLoginRow) error {
	// generate a random session ID
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return err
	}

	session := base64.URLEncoding.EncodeToString(bytes)

	// expire after 15 minutes
	expiry := time.Now().Add(time.Minute * 15)

	// set session cookie
	ctx.SetCookie(&http.Cookie{
		Name:     "session",
		Value:    session,
		Expires:  expiry,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	// add session to database
	if err := database.DB.Queries.CreateSession(ctx.Request().Context(), db.CreateSessionParams{
		ID:      session,
		AdminID: admin.ID,
		Expiry:  expiry.Unix(),
	}); err != nil {
		return err
	}

	// return nil error
	return nil
}

// revokes a session cookie and removes the session from the database
func RevokeSession(ctx echo.Context) {
	// get session cookie
	session, err := ctx.Cookie("session")
	if err != nil {
		return
	}

	// remove from database
	if err := database.DB.Queries.DeleteSession(ctx.Request().Context(), session.Value); err != nil {
		return
	}

	// revoke the cookie
	session.Value = "revoked"
	session.MaxAge = -1
	session.Expires = time.Now()
	ctx.SetCookie(session)
	return
}
