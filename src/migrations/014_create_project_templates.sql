CREATE TABLE IF NOT EXISTS project_templates (
  project_id      VARCHAR(255) NOT NULL,
  template_id     VARCHAR(255) NOT NULL,
  PRIMARY KEY(project_id, template_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (template_id) REFERENCES templates(id)
);