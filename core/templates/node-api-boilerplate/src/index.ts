import app from "./app";
import dotenv from "dotenv";
import pool from "./db/postgres";
import { loadLoincCodes } from "./utils/loincLoader";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sincronizar la base de datos
    await pool.query("SELECT 1");
    console.log("Conexión a la base de datos exitosa.");

    // Cargar códigos LOINC
    await loadLoincCodes("src/db/csv/Loinc.csv");
    console.log("Códigos LOINC cargados en memoria.");

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
