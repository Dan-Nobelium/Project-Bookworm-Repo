-- +goose Up
CREATE TABLE IF NOT EXISTS admin (
	id TEXT PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL CHECK (email LIKE '_%@_%.__%'),
	superuser INT NOT NULL CHECK (superuser IN (0, 1)),
	created_at INT NOT NULL DEFAULT (strftime('%s', 'now')),
	updated_at INT NOT NULL DEFAULT (strftime('%s', 'now'))
) STRICT;

-- +goose StatementBegin
CREATE TRIGGER
  update_admin
AFTER UPDATE ON
  admin
FOR EACH ROW
BEGIN
  UPDATE
    admin
  SET
    updated_at = strftime('%s', 'now')
  WHERE
    id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE admin;
