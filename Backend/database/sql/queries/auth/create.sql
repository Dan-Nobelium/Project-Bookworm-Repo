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

-- name: CreateSession :exec
INSERT INTO
	session (id, admin_id, expiry)
VALUES
	(?, ?, ?);
