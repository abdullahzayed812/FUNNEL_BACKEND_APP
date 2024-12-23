CREATE TABLE IF NOT EXISTS projects (
    id          VARCHAR(255) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    website     VARCHAR(255) NOT NULL,
);