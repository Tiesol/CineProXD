SELECT * FROM "user"
LEFT JOIN follower ON "user".id = follower."userId";