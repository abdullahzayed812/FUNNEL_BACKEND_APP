import pool from "../configs/db";

const createPersonasTable = async () => {
  try {
    // Create users table
    const createPersonasTableQuery = `
        CREATE TABLE images (
            id              VARCHAR(255) PRIMARY KEY,
            file_path       VARCHAR(255) NOT NULL,
            image_type   ENUM('Default', 'Branded', 'Customized') NOT NULL,
            is_selected     BOOLEAN,
            project_id      VARCHAR(255) NOT NULL,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createPersonasTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
