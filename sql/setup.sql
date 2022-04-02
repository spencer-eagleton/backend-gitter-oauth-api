-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users;

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT
);

DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    body TEXT NOT NULL,
    user_id BIGINT REFERENCES github_users(id)
);

INSERT INTO posts (body)
VALUES 
    ('THIS IS MY POST'),
    ('THIS IS MY SECOND POST');