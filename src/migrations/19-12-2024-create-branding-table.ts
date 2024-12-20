import pool from "../configs/db";

const createBrandingTable = async () => {
  try {
    // Create users table
    const createBrandingTableQuery = `
        CREATE TABLE branding (
            id VARCHAR(255) PRIMARY KEY,
            project_id VARCHAR(255) UNIQUE NOT NULL,
            primary_color VARCHAR(7),
            secondary_color VARCHAR(7),
            additional_color VARCHAR(7),
            primary_font    VARCHAR(25),
            secondary_font VARCHAR(25),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createBrandingTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
