import { Router } from "express";
import { CorreoController } from "../../controllers/correo/correo.controller.js";

const router = Router();


router.post("/enviar-correo", CorreoController.enviarCorreoyCuerpo);

export default router;
