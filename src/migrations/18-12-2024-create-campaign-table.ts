import pool from "../configs/db";

const createCampaignTable = async () => {
  try {
    // Create users table
    const createCampaignTableQuery = `
        CREATE TABLE campaigns (
            id          VARCHAR(255) PRIMARY KEY,
            name        VARCHAR(255) NOT NULL,
            description TEXT,
            start_date  DATE,
            end_date    DATE,
            budget      DECIMAL(10, 2)
            agency_id   VARCHAR(255) NOT NULL,
            customer_id VARCHAR(255) NOT NULL,
            FOREIGN KEY (agency_id) REFERENCES users(id),
            FOREIGN KEY (customer_id) REFERENCES users(id)
        );
    `;

    await pool.query(createCampaignTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
