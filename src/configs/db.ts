import mysql from "mysql2/promise";

// DB Configuration for Dependency Injection
export class DBConfig {
  private static instance: DBConfig;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "abdo",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "funnel_db",
      waitForConnections: true, // Wait for an available connection if all are in use
      connectionLimit: 10, // Maximum number of connections allowed in the pool
      queueLimit: 0, // Unlimited waiting requests
    });
  }

  // Singleton pattern to ensure only one DBConfig instance
  public static getInstance(): DBConfig {
    if (!DBConfig.instance) {
      DBConfig.instance = new DBConfig();
    }
    return DBConfig.instance;
  }

  public getPool(): mysql.Pool {
    return this.pool;
  }
}
