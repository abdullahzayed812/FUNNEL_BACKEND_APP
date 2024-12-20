import pool from "../configs/db";

const createProjectsTable = async () => {
  try {
    // Create users table
    const createProjectsTableQuery = `
        CREATE TABLE projects (
            id          VARCHAR(255) PRIMARY KEY,
            name        VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            website     VARCHAR(255) NOT NULL,
        );
    `;

    await pool.query(createProjectsTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
