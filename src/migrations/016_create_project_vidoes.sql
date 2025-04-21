CREATE TABLE IF NOT EXISTS project_videos (
  project_id      VARCHAR(255) NOT NULL,
  video_id     VARCHAR(255) NOT NULL,
  PRIMARY KEY(project_id, video_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (video_id) REFERENCES videos(id)
);