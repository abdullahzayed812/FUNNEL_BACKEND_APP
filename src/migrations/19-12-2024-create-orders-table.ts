import pool from "../configs/db";

const createOrdersTable = async () => {
  try {
    // Create users table
    const createOrdersTableQuery = `
        CREATE TABLE orders (
            id VARCHAR(255) PRIMARY KEY,  
            campaign_manager_id VARCHAR(255) NOT NULL,  
            end_user_id VARCHAR(255) NOT NULL,  
            project_id VARCHAR(255) NOT NULL,  
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
            campaign_name VARCHAR(255) NOT NULL,  
            industry VARCHAR(255),  
            category VARCHAR(255),  
            status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',  
            total_budget DECIMAL(10, 2) NOT NULL,  
            payment_status ENUM('Paid', 'Unpaid', 'Pending') DEFAULT 'Unpaid',  
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
            FOREIGN KEY (campaign_manager_id) REFERENCES users(id),  
            FOREIGN KEY (end_user_id) REFERENCES users(id),  
            FOREIGN KEY (project_id) REFERENCES projects(id)  
        );
    `;

    await pool.query(createOrdersTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
