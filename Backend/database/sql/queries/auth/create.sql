-- name: CreateAdmin :one
INSERT INTO
	admin (first_name, last_name, email, superuser)
VALUES
	(?, ?, ?, ?)
RETURNING
	*;

-- name: CreateCredential :exec
INSERT INTO
	credential (admin_id, password_hash)
VALUES
	(?, ?);

-- name: CreateSession :one
INSERT INTO
	session (admin_id, expiry)
VALUES
	(?, ?)
RETURNING
	id;
