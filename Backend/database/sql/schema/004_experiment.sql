-- +goose Up
CREATE TABLE IF NOT EXISTS experiment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url_path TEXT UNIQUE NOT NULL,
  directory_path TEXT UNIQUE NOT NULL,
  max_trials INT NOT NULL CHECK (max_trials > 0),
  status INT NOT NULL CHECK (status IN (0, 1)),
  created_by TEXT NOT NULL REFERENCES admin(id),
  created_at INT NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INT NOT NULL DEFAULT (strftime('%s', 'now'))
) STRICT;

-- +goose StatementBegin
CREATE TRIGGER
  update_experiment
AFTER UPDATE ON
  experiment
FOR EACH ROW
BEGIN
  UPDATE
    experiment
  SET
    updated_at = strftime('%s', 'now')
  WHERE
    id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE experiment;
