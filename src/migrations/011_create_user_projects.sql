CREATE TABLE IF NOT EXISTS user_projects (
  user_id       VARCHAR(255) NOT NULL,  
  project_id    VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id, project_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);