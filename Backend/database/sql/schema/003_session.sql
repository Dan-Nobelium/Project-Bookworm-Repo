-- +goose Up
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
  expiry INT NOT NULL
) STRICT;

-- +goose Down
DROP TABLE session;
