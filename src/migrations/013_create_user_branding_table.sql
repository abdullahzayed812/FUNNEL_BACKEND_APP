CREATE TABLE IF NOT EXISTS user_branding (
  user_id         VARCHAR(255) NOT NULL,
  branding_id     VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id);
  FOREIGN KEY (branding_id) REFERENCES branding(id);
  FOREIGN KEY (project_id) REFERENCES projects(id);
);