-- +goose Up
CREATE TABLE IF NOT EXISTS credential (
  admin_id TEXT PRIMARY KEY REFERENCES admin(id) ON DELETE CASCADE,
  password_hash BLOB NOT NULL,
  created_at INT NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INT NOT NULL DEFAULT (strftime('%s', 'now'))
) STRICT;

-- +goose StatementBegin
CREATE TRIGGER
  update_credential
AFTER UPDATE ON
  credential
FOR EACH ROW
BEGIN
  UPDATE
    credential
  SET
    updated_at = strftime('%s', 'now')
  WHERE
    user_id = NEW.user_id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE credential;
