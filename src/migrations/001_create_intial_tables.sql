CREATE TABLE IF NOT EXISTS users (
    id                         VARCHAR(255) PRIMARY KEY,
    username                   VARCHAR(255) NOT NULL UNIQUE,
    email                      VARCHAR(255) NOT NULL UNIQUE,
    password                   VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role                       VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    id          VARCHAR(255) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    type        ENUM('Default', 'Customized'),
    description VARCHAR(255) NOT NULL,
    website     VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    image_type      ENUM('Default', 'Customized') NOT NULL,
    project_id      VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS templates (
    id                      VARCHAR(255) PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    type                    ENUM('Default', 'Branded', 'Customized') NOT NULL,
    frame_svg               TEXT NOT NULL,
    default_primary         VARCHAR(7) NOT NULL,
    default_secondary_color VARCHAR(7) NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_id              VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS template_text (
    id              VARCHAR(255) PRIMARY KEY,
    type            ENUM('headline', 'punchline', 'cta'),
    text            TEXT NOT NULL,
    font_size       INT,
    font_family     VARCHAR(255),
    font_weight     VARCHAR(25),
    text_decoration VARCHAR(15),
    font_style      VARCHAR(255),
    border_radius   INT,
    border_width    INT,
    border_style    VARCHAR(8),
    border_color    VARCHAR(10),   
    container_color VARCHAR(7),
    text_color      VARCHAR(7),
    language        VARCHAR(2),
    x_coordinate    INT,
    y_coordinate    INT,
    color           VARCHAR(20),
    template_id     VARCHAR(255) NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS videos (
    id              VARCHAR(255) PRIMARY KEY,
    file_path       VARCHAR(255) NOT NULL,
    video_type      ENUM('Default', 'Customized') NOT NULL,
    project_id      VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS branding (
    id                  VARCHAR(255) PRIMARY KEY,
    primary_color       VARCHAR(7),
    secondary_color     VARCHAR(7),
    additional_color    VARCHAR(7),
    primary_font        VARCHAR(25),
    secondary_font      VARCHAR(25),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    type                ENUM('Default', 'Customized'),
    project_id          VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS user_projects (
    project_id  VARCHAR(255) NOT NULL,
    user_id     VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_templates (
  user_id         VARCHAR(255) NOT NULL,
  template_id     VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  is_selected     BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_images (
  user_id         VARCHAR(255) NOT NULL,
  image_id        VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  is_selected     BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_videos (
  user_id         VARCHAR(255) NOT NULL,
  video_id        VARCHAR(255) NOT NULL,
  project_id      VARCHAR(255) NOT NULL,
  is_selected     BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_branding (
  user_id         VARCHAR(255) NOT NULL,
  branding_id     VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);