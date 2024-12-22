CREATE TABLE IF NOT EXISTS videos (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    video_type      ENUM('Default', 'Branded', 'Customized') NOT NULL,
    is_selected     BOOLEAN,
    project_id      VARCHAR(255) NOT NULL,
    user_id         VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);