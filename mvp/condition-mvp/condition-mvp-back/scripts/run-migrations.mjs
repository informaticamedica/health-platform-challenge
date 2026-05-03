import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: ["1", "true", "yes", "on"].includes(
    String(process.env.DB_SSL || "").toLowerCase()
  )
    ? {
        rejectUnauthorized: ["1", "true", "yes", "on"].includes(
          String(process.env.DB_SSL_REJECT_UNAUTHORIZED || "").toLowerCase()
        ),
      }
    : false,
});

const migrationsDir = path.resolve(__dirname, "../src/db/migrations");

async function run() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Applied migration: ${file}`);
  }

  await pool.end();
}

run().catch(async (error) => {
  console.error("Migration error", error);
  await pool.end();
  process.exit(1);
});
