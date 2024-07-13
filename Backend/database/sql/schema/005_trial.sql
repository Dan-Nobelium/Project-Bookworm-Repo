-- +goose Up
CREATE TABLE IF NOT EXISTS trial (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL REFERENCES experiment(id),
  data BLOB NOT NULL,
  created_at INT NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INT NOT NULL DEFAULT (strftime('%s', 'now'))
) STRICT;

-- +goose StatementBegin
CREATE TRIGGER
  update_trial
AFTER UPDATE ON
  trial
FOR EACH ROW
BEGIN
  UPDATE
    trial
  SET
    updated_at = strftime('%s', 'now')
  WHERE
    id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE trial;
