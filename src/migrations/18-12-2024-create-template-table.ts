import pool from "../configs/db";

const createTemplatesTable = async () => {
  try {
    // Create users table
    const createTemplatesTableQuery = `
        CREATE TABLE templates (
            id                      VARCHAR(255) PRIMARY KEY,
            name                    VARCHAR(255) NOT NULL,
            template_type           ENUM('Default', 'Branded', 'Customized') NOT NULL,
            frame_svg               VARCHAR(800) NOT NULL,
            default_primary         VARCHAR(7) NOT NULL,
            default_secondary_color VARCHAR(7) NOT NULL,
            is_selected             BOOLEAN
            created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            project_id              VARCHAR(255) NOT NULL,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createTemplatesTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
