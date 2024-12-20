const createUserRolesTable = async () => {
  try {
    // Create users table
    const createUserRolesTableQuery = `
        CREATE TABLE user_roles (
            id          VARCHAR(255) PRIMARY KEY,
            name   VARCHAR(255) NOT NULL UNIQUE
        );
    `;

    await pool.query(createUserRolesTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the pool connection after migrations are done
    pool.end();
  }
};
