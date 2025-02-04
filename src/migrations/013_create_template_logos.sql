CREATE TABLE IF NOT EXISTS template_logos (
  id          VARCHAR(255) PRIMARY KEY NOT NULL,
  type        VARCHAR(50) NOT NULL,
  logo_data   LONGBLOB NOT NULL,
  template_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id)
);