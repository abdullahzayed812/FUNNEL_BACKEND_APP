CREATE TABLE IF NOT EXISTS project_templates (
  id           VARCHAR(255) PRIMARY KEY NOT NULL,
  template_id  VARCHAR(255) NOT NULL,
  project_id   VARCHAR(255) NOT NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);