import { Router } from "express"
import { EmpresaController } from "../../controllers/empresa/empresa.controller.js"
import fileUploadMiddleware from "../../middlewares/fileUploadMiddleware.js";

const router = Router()

// Rutas para la gestión de perfiles de empresa
router.post("/crearPerfilEmpresa", fileUploadMiddleware,
    EmpresaController.crearPerfilEmpresa)

router.delete("/", EmpresaController.eliminarPerfilEmpresa)

export default router;