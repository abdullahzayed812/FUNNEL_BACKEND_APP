import fs from "node:fs";
import path from "node:path";
import { DBConfig } from "../configs/db";
const dbConfig = DBConfig.getInstance();
const dbPool = dbConfig.getPool();
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(decodeURIComponent(__filename)); // Decode the URL for cross-platform compatibility
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
async function isSeedApplied(seedName) {
    const sqlQuery = "SELECT * FROM seeds WHERE seed_name = ?";
    const [rows] = await dbPool.query(sqlQuery, [seedName]);
    return Array.isArray(rows) && rows.length > 0;
}
async function insertSeedRecord(seedName) {
    const insertQuery = "INSERT INTO seeds (seed_name) VALUES (?)";
    await dbPool.query(insertQuery, [seedName]);
}
export async function runSeeds() {
    await createSeedsTableIfNotExist();
    const seedsDir = path.join(__dirname, "./");
    const seedFiles = fs.readdirSync(seedsDir).filter((file) => file.endsWith(".sql"));
    for (const file of seedFiles) {
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
            await insertSeedRecord(file);
        }
        catch (err) {
            console.error(`Error running seed ${file}:`, err);
        }
    }
}
