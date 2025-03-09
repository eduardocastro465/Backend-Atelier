import { Router } from "express";
import { verificaToken } from "../../middlewares/jwt.middlewares.js";
import { UserController } from "../../controllers/usuario/user.controller.js";

const router = Router();

router.get("/perfil", verificaToken, UserController.perfil);

export default router;
