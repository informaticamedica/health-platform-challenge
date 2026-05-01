import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.route";
import patientRoutes from "./routes/patient.route";
import observationRoutes from "./routes/observation.route";
import errorMiddleware from "./middlewares/error.middleware";

// Crear la aplicación
const app: Application = express();

// Middlewares globales
app.use(express.json()); // Parseo de JSON
app.use(cors()); // Habilitar CORS
app.use(helmet()); // Configuraciones de seguridad
app.use(morgan("dev")); // Log de peticiones

// Rutas
app.use("/auth", authRoutes); // Rutas de autenticación
app.use("/patients", patientRoutes); // Rutas de pacientes
app.use("/observations", observationRoutes); // Rutas de observaciones

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});
// Registro del middleware de manejo de errores
app.use(errorMiddleware);

export default app;
