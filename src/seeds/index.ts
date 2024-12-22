import fs from "node:fs";
import path from "node:path";
import { DBConfig } from "../configs/db";

const dbConfig = DBConfig.getInstance();
const dbPool = dbConfig.getPool();

// Use import.meta.url to get the current module's URL
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Create the seeds table if it doesn't exist
async function createSeedsTableIfNotExist() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS seeds (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      seed_name   VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await dbPool.query(createTableQuery);
}

// Function to check if seed data has been applied
async function isSeedApplied(seedName: string) {
  const sqlQuery = "SELECT * FROM seeds WHERE seed_name = ?";
  const [rows] = await dbPool.query(sqlQuery, [seedName]);
  return Array.isArray(rows) && rows.length > 0;
}

// Function to insert seed record into the seeds table
async function insertSeedRecord(seedName: string) {
  const insertQuery = "INSERT INTO seeds (seed_name) VALUES (?)";
  await dbPool.query(insertQuery, [seedName]);
}

// Function to run seeds
export async function runSeeds() {
  await createSeedsTableIfNotExist();

  const seedsDir = path.join(__dirname, "./");
  const seedFiles = fs.readdirSync(seedsDir).filter((file) => file.endsWith(".sql"));

  for (const file of seedFiles) {
    // Skip if seed has already been applied
    if (await isSeedApplied(file)) {
      console.log(`Seed ${file} has already been applied.`);
      continue;
    }

    const filePath = path.join(seedsDir, file);
    const seedSql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`Running seed: ${file}`);
      await dbPool.query(seedSql);
      console.log(`Seed ${file} completed.`);

      // Insert seed record into the seeds table
      await insertSeedRecord(file);
    } catch (err) {
      console.error(`Error running seed ${file}:`, err);
    }
  }
}
