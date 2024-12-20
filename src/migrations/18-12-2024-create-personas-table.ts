import pool from "../configs/db";

const createPersonasTable = async () => {
  try {
    // Create users table
    const createPersonasTableQuery = `
        CREATE TABLE personas (
            id              VARCHAR(255) PRIMARY KEY,
            name            VARCHAR(255) NOT NULL,
            age_group       VARCHAR(100),
            number_of_ads   INT NOT NULL,
            gender          VARCHAR(50),
            interests       TEXT,
            location        VARCHAR(255)
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
