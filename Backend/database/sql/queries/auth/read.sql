-- name: GetAdminByEmail :one
SELECT
	*
FROM
	admin
WHERE
	email = ?;

-- name: GetAdminLogin :one
SELECT
	*
FROM
	admin AS a
	LEFT JOIN credential AS c ON a.id = c.admin_id
WHERE
	a.email = ?;

-- name: GetSession :one
SELECT
	*
FROM
	session
WHERE
	id = ?;
