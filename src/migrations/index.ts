import fs from "node:fs";
import path from "node:path";
import { DBConfig } from "../configs/db";

const dbConfig = DBConfig.getInstance();
const dbPool = dbConfig.getPool();

// Use import.meta.url to get the current module's URL
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Create the migrations table if it doesn't exist
async function createMigrationsTableIfNotExist() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await dbPool.query(createTableQuery);
}

// Function to check if migration has been applied
async function isMigrationApplied(migrationName: string) {
  const sqlQuery = "SELECT * FROM migrations WHERE migration_name = ?";
  const [rows] = await dbPool.query(sqlQuery, [migrationName]);
  return Array.isArray(rows) && rows.length > 0;
}

// Function to insert migration record into the migrations table
async function insertMigrationRecord(migrationName: string) {
  const insertQuery = "INSERT INTO migrations (migration_name) VALUES (?)";
  await dbPool.query(insertQuery, [migrationName]);
}

// Function to run migration
export async function runMigrations() {
  await createMigrationsTableIfNotExist();

  const migrationsDir = path.join(__dirname, "./");
  const migrationFiles = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"));

  for (const file of migrationFiles) {
    if (await isMigrationApplied(file)) {
      console.log(`Migration ${file} has already been applied.`);
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const migrationSql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`Running migration: ${file}`);
      await dbPool.query(migrationSql);
      console.log(`Migration ${file} completed.`);
      await insertMigrationRecord(file);
    } catch (err) {
      console.error(`Error running migration ${file}:`, err);
    }
  }
}