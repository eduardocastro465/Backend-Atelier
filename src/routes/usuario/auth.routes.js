import { Router } from "express";
import { AuthController } from "../../controllers/usuario/auth.controller.js";

const router = Router();

router.post("/register", AuthController.registrarUsuario);
router.post("/login", AuthController.Login);
router.post("/signIn-Google-Facebook", AuthController.signInGoogleFacebook);

router.post("/check-email", AuthController.verificarCorreo);
router.post("/check-telefono", AuthController.verificarTelefono);


export default router;
