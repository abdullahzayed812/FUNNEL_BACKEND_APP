CREATE TABLE IF NOT EXISTS templates (
  id                      VARCHAR(255) PRIMARY KEY,
  type                    ENUM('Default', 'Branded', 'Customized') NOT NULL,
  tag                     VARCHAR(25) NOT NULL,
  name                    VARCHAR(255) NOT NULL,
  frame_svg               TEXT NOT NULL,
  default_primary         VARCHAR(7) NOT NULL,
  default_secondary_color VARCHAR(7) NOT NULL,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id                 VARCHAR(255) NOT NULL,
  project_id              VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);