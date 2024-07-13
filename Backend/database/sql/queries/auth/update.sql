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
