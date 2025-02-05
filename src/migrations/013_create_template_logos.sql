CREATE TABLE IF NOT EXISTS template_logos (
  id            VARCHAR(255) PRIMARY KEY NOT NULL,
  logo_data     LONGBLOB NOT NULL,
  x_coordinate  DECIMAL(5,2) NOT NULL,
  y_coordinate  DECIMAL(5,2) NOT NULL,
  template_id   VARCHAR(255) NOT NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id)
);