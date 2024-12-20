import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.USER || "abdo",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "funnel_db",
  waitForConnections: true, // Wait for an available connection if all are in use
  connectionLimit: 10, // Maximum number of connections allowed in the pool
  queueLimit: 0, // Unlimited waiting requests
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to the database: ", error.message);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully!");
    connection.release();
  }
});

function queryAndClose() {
  // Perform the query
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return;
    }

    console.log("Users:", results);

    // Close the pool after the query completes
    pool.end((err) => {
      if (err) {
        console.error("Error closing the pool:", err);
        return;
      }
      console.log("MySQL pool closed.");
    });
  });
}

// Execute the function
queryAndClose();

export default pool.promise();
