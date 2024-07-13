-- name: DeleteSession :exec
DELETE FROM
	session
WHERE
	id = ?;

-- name: DeleteAdmin :exec
DELETE FROM
	admin
WHERE
	id = ?;
