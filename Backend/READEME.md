# Project Bookworm Go Backend

## Download Go
https://go.dev/learn/

## Command Line Tools Required
### SQLC
- Install @ https://docs.sqlc.dev/en/stable/overview/install.html
- Used to generate Go code from SQL queries
- Config found at /Backend/sqlc.yaml
- CLI Arg: `sqlc generate`

### Goose
- Install @ https://github.com/pressly/goose
- Used to migrate SQL defined schema to a database
- No config required
- CLI Arg: `goose -dir database/sql/schema sqlite database/database.db up`

### Templ
- Install @ https://templ.guide/quick-start/installation
- Used to generate Go code from templ templating language
- No config required
- CLI Arg: `templ generate`
- Note: Air will automatically run this command

### Air
- Install @ https://github.com/air-verse/air
- Used to automate the generation of templ templates and recompile the project on any changes
- CLI Arg: `air`

## Running the project
After downloading the repo, use the below CLI Args in order to successcully run the Go back end
- `go mod tidy`
  - this will download all the required dependencies
- `air`
  - this will automatically generate all the templ templates and compile the backend
- Navigate to `localhost:8000` to see the backend in action

## Troubleshooting
- Make sure your project is up to date `git pull`
- Make sure the branch you are working on is up to date with main `git merge main`
- Periodically run `go mod tidy` to ensure you have all the dependecies
- Try killing the air process and restarting it
- Read the tracebacks to see where the error is and ask for help if you can figure it out
