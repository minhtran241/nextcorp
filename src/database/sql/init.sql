-- init.sql
-- docker exec -it nextcorp_postgres_container psql -U postgres -d nextcorp -f /sql/init.sql
CREATE DATABASE nextcorp;

\c nextcorp;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
	slug VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
	word_count INTEGER NOT NULL,
    read_time INTEGER NOT NULL,
	view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
	revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, avatar, is_admin, created_at) 
VALUES 
  ('minhtran', '$argon2id$v=19$m=65536,t=2,p=1$TQtwv6USIyH5plqr4C156E2W72zSMKeCgfM9t53SpFs$pwSE9hXPPunhBxN/bFVQ0xvLPuzV2GUZ2vNobM6KXcI', 'user1@example.com', 'https://images.pexels.com/photos/20225732/pexels-photo-20225732/free-photo-of-a-woman-holding-a-bunch-of-roses-in-front-of-her-face.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load', true, NOW()),
  ('datnguyen', '$argon2id$v=19$m=65536,t=2,p=1$TQtwv6USIyH5plqr4C156E2W72zSMKeCgfM9t53SpFs$pwSE9hXPPunhBxN/bFVQ0xvLPuzV2GUZ2vNobM6KXcI', 'user2@example.com', 'https://images.pexels.com/photos/20051870/pexels-photo-20051870/free-photo-of-a-man-leaning-against-a-wall-in-a-white-sweater.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load', false, NOW());
