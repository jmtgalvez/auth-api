CREATE TABLE IF NOT EXISTS user ( 
    id          TEXT PRIMARY KEY,
    username    TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    createdAt   DATETIME DEFAULT current_timestamp,
    updatedAt   TIMESTAMP DEFAULT current_timestamp
);