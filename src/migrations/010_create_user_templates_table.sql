CREATE TABLE IF NOT EXISTS user_templates (
  user_id         VARCHAR(255) NOT NULL,
  template_id     VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  is_selected     VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);