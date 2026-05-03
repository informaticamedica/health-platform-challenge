import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createCondition,
  deleteCondition,
  getConditionById,
  getConditions,
  getConditionsByPatient,
  updateCondition,
} from "../controllers/condition.controller";

const router = Router();

router.get("/", authenticate, getConditions);
router.get("/patient/:id", authenticate, getConditionsByPatient);
router.get("/:id", authenticate, getConditionById);
router.post("/", authenticate, createCondition);
router.put("/:id", authenticate, updateCondition);
router.delete("/:id", authenticate, deleteCondition);

export default router;
