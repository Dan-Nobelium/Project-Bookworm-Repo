-- name: UpdateAdminInfo :one
UPDATE
	admin
SET
	email = ?,
	superuser = ?
WHERE
	id = ?
RETURNING
	*;

-- name: UpdatePassword :exec
UPDATE
	credential
SET
	password_hash = ?
WHERE
	admin_id = ?;
