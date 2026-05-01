import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register); // Registrar un nuevo usuario (nombre, email, contraseña)
router.post("/login", login); //  Iniciar sesión, devolver un token JWT si las credenciales son válidas.

export default router;
