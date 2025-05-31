import { Router } from "express"
import { ReseniaController } from "../../controllers/empresa/resenia.controller.js"

const router = Router()

// Rutas para la gestión de reseñas de la empresa
router.post("/", ReseniaController.crearResenia)

export default router;