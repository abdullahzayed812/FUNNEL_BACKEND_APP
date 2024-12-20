import pool from "../configs/db";

const createUsersTable = async () => {
  try {
    // Create users table
    const createUsersTableQuery = `
      CREATE TABLE users (
          id              VARCHAR(255) PRIMARY KEY,
          username        VARCHAR(255) NOT NULL UNIQUE,
          email           VARCHAR(255) NOT NULL UNIQUE,
          password        VARCHAR(255) NOT NULL,
          created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          role_id         VARCHAR(255) NOT NULL,
          FOREIGN KEY (role_id) REFERENCES user_roles(id)
      );
    `;

    await pool.query(createUsersTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
