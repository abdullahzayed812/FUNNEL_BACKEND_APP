import pool from "../configs/db";

const createRolesTable = async () => {
  try {
    // Create users table
    const createRolesTableQuery = `
        CREATE TABLE roles (
            id      INT AUTO_INCREMENT PRIMARY KEY,
            name    VARCHAR(255) NOT NULL
        );
    `;

    await pool.query(createRolesTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
