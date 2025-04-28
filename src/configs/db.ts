import pg from "pg";
const { Pool } = pg;

// DB Configuration for Dependency Injection
export class DBConfig {
  private static instance: DBConfig;
  private pool: InstanceType<typeof Pool>; // Correct usage for the type

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || "3.71.248.31",
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

  public getPool(): InstanceType<typeof Pool> {
    return this.pool;
  }
}
