import pool from "../configs/db";

const createAdsTable = async () => {
  try {
    // Create users table
    const createAdsTableQuery = `
        CREATE TABLE ads (
            id          VARCHAR(255) PRIMARY KEY,
            content     TEXT,
            budget      DECIMAL(10, 2),
            duration    INT,  -- in days
            start_date  DATE,
            end_date    DATE,
            campaign_id VARCHAR(255) NOT NULL,
            persona_id  VARCHAR(255) NOT NULL,
            FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
            FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createAdsTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
