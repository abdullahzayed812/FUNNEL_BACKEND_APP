CREATE TABLE IF NOT EXISTS users (
    id                         VARCHAR(255) PRIMARY KEY,
    username                   VARCHAR(255) NOT NULL UNIQUE,
    email                      VARCHAR(255) NOT NULL UNIQUE,
    password                   VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role                       VARCHAR(255) NOT NULL,
    facebook_authentication_id VARCHAR(255),
    FOREIGN KEY (facebook_authentication_id) REFERENCES facebook_authentication(id)
);