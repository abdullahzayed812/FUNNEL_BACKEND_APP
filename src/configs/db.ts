import { Pool } from "pg";

// DB Configuration for Dependency Injection
export class DBConfig {
  private static instance: DBConfig;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "asdfgASDFG@#6",
      database: process.env.DB_NAME || "funnel_db",
      port: Number(process.env.DB_PORT) || 5532,
      max: 10,
    });
  }

  public static getInstance(): DBConfig {
    if (!DBConfig.instance) {
      DBConfig.instance = new DBConfig();
    }
    return DBConfig.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }
}
