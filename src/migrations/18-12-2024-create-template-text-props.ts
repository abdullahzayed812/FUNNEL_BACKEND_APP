import pool from "../configs/db";

const createTemplateTextTable = async () => {
  try {
    // Create users table
    const createTemplateTextTableQuery = `
          CREATE TABLE template_text (
            id              VARCHAR(255) PRIMARY KEY,
            name            VARCHAR(255) NOT NULL,
            font_size       INT,
            font_family     INT,
            font_weight     INT,
            text_decoration VARCHAR(15),
            font_style      VARCHAR(255),
            border_radius   INT,
            border_color    VARCHAR(255),
            border_width    INT,
            border_style    VARCHAR(8),
            border_color    VARCHAR(7),   
            container_color VARCHAR(7),
            text_color      VARCHAR(7),
            language        VARCHAR(2),
            x_coordinate    INT,
            y_coordinate    INT,
            color           VARCHAR(20),
            project_id      VARCHAR(255) NOT NULL,
            template_id     VARCHAR(255) NOT NULL,
            FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createTemplateTextTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
