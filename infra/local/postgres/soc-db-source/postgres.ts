import { Pool } from "pg";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false, // Esto permite conexiones SSL sin verificar el certificado
  },
});

export default pool;
