import { Router } from "express";
import { AuthController } from "../../controllers/usuario/auth.controller.js";

const router = Router();

router.post("/register", AuthController.crearUsuario);

router.post("/login", AuthController.Login);

export default router;
