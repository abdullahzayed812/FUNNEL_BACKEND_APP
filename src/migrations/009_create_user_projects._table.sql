CREATE TABLE IF NOT EXISTS user_projects (
    project_id  VARCHAR(255) NOT NULL,
    user_id     VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
