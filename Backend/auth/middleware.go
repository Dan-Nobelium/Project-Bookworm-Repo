package auth

import "github.com/labstack/echo/v4"

// wraps a route handler and checks if authorised, otherwise, redirects to login
func Admin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		// validate session
		adminId, valid := ValidateSession(ctx)
		if valid {
			// add admin ID to context for use in the next handler function
			ctx.Set("adminId", adminId)
		}

		// set loggedIn context to true if adminId exists on context, else false
		ctx.Set("loggedIn", ctx.Get("adminId") != nil)

		// continue to the next handler function
		return next(ctx)
	}
}
