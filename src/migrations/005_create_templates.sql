CREATE TABLE IF NOT EXISTS templates (
  id                      VARCHAR(255) PRIMARY KEY,
  name                    VARCHAR(255) NOT NULL,
  type                    ENUM('Default', 'Branded', 'Customized') NOT NULL,
  frame_svg               TEXT NOT NULL,
  default_primary         VARCHAR(7) NOT NULL,
  default_secondary_color VARCHAR(7) NOT NULL,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id                 VARCHAR(255) NOT NULL,
  project_id              VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);