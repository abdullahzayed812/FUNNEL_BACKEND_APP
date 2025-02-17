CREATE TABLE IF NOT EXISTS user_images (
  user_id         VARCHAR(255) NOT NULL,
  image_id        VARCHAR(255) NOT NULL,
  is_selected     BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);