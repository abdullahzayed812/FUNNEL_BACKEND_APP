CREATE TABLE IF NOT EXISTS user_videos (
  user_id         VARCHAR(255) NOT NULL,
  video_id        VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  is_selected     VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);