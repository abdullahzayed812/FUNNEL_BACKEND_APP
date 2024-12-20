import pool from "../configs/db";

const createCampaignPersonasTable = async () => {
  try {
    // Create users table
    const createCampaignPersonasTableQuery = `
        CREATE TABLE campaign_personas (
            campaign_id     VARCHAR(255) NOT NULL,
            persona_id      VARCHAR(255) NOT NULL,
            PRIMARY KEY (campaign_id, persona_id),
            FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
            FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
        );
    `;

    await pool.query(createCampaignPersonasTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
