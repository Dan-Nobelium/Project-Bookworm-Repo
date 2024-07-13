-- name: GetAdminByEmail :one
SELECT
	*
FROM
	admin
WHERE
	email = ?;

-- name: GetSession :one
SELECT
	*
FROM
	session
WHERE
	id = ?;
