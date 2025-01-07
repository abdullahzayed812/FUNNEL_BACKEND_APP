CREATE TABLE IF NOT EXISTS images (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    image_type      ENUM('Default', 'Customized') NOT NULL
);