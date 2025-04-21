CREATE TABLE IF NOT EXISTS project_images (
  project_id      VARCHAR(255) NOT NULL,
  image_id     VARCHAR(255) NOT NULL,
  PRIMARY KEY(project_id, image_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (image_id) REFERENCES images(id)
);