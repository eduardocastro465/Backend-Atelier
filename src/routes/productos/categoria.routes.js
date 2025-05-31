import { Router } from "express";
import { CategoriaController } from "../../controllers/productos/categoria.controller.js";

const router = Router();

router.get("/", CategoriaController.obtenerCategorias)

router.get("/:id", CategoriaController.obtenerCategoriaPorId)

router.post("/", CategoriaController.agregarCategoria);
router.put("/:id", CategoriaController.editarCategoria);
router.delete("/:id", CategoriaController.eliminarCategoria);

export default router;
