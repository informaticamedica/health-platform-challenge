import { Pool } from "pg";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const sslEnabled = ["1", "true", "yes", "on", "require"].includes(
  (process.env.DB_SSL ?? "").toLowerCase()
);

const sslRejectUnauthorized = ["1", "true", "yes", "on"].includes(
  (process.env.DB_SSL_REJECT_UNAUTHORIZED ?? "false").toLowerCase()
);

// Configuracion de la conexion a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: sslEnabled ? { rejectUnauthorized: sslRejectUnauthorized } : false,
});

export default pool;
