import { Router } from "express";
import {
  deleteObservation,
  getObservationCategories,
  getLoincSuggestions,
  updateObservationFhir,
  getFhirObservation,
} from "../controllers/observation.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Rutas para las observaciones
router.get("/categories", authenticate, getObservationCategories);
router.get("/loinc", authenticate, getLoincSuggestions);
router.get("/:id/fhir", authenticate, getFhirObservation); // Muestra en formato Fhir una observacion

router.put("/:id", authenticate, updateObservationFhir); // Actualiza una observación existente
router.delete("/:id", authenticate, deleteObservation); // Eliminar una observación clínica.

export default router;
