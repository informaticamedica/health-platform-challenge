import fs from "node:fs";
import path from "node:path";
import pool from "../db/postgres";

export async function resetDbSchema(): Promise<void> {
  const ddlPath = path.resolve(process.cwd(), "src/db/sql/ddl.fhir.sql");
  const ddl = fs.readFileSync(ddlPath, "utf8");
  const statements = ddl
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(`${statement};`);
  }
}

export async function closeDb(): Promise<void> {
  await pool.end();
}
