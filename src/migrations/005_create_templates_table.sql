CREATE TABLE IF NOT EXISTS templates (
    id                      VARCHAR(255) PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    type                    ENUM('Default', 'Branded', 'Customized') NOT NULL,
    frame_svg               TEXT NOT NULL,
    default_primary         VARCHAR(7) NOT NULL,
    default_secondary_color VARCHAR(7) NOT NULL,
    is_selected             BOOLEAN,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_id              VARCHAR(255) NOT NULL,
    user_id                 VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);