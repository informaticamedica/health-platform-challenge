import { Router } from "express";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  deletePatient,
  updatePatient,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  addObservation,
  getObservations,
} from "../controllers/observation.controller";

const router = Router();

// Rutas de pacientes
router.get("/", authenticate, getAllPatients); // Obtener una lista de todos los pacientes
router.get("/:id", authenticate, getPatientById); // Obtener los detalles de un paciente específico
router.get("/:id/observations", authenticate, getObservations); // Obtener todas las observaciones clínicas de un paciente
router.post("/:id/observations", authenticate, addObservation); // Crear una nueva observación clínica para un paciente especíco.

router.post("/", authenticate, createPatient); // crear paciente
router.delete("/:id", authenticate, deletePatient); // eliminar paciente
router.put("/:id", authenticate, updatePatient); // editar paciente

export default router;
