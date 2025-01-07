CREATE TABLE IF NOT EXISTS videos (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    video_type      ENUM('Default', 'Customized') NOT NULL
);