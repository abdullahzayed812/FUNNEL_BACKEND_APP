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