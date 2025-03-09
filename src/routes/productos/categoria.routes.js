import { Router } from "express";
import { CategoriaController } from "../../controllers/productos/categoria.controller.js";

const router = Router();

router.get("/",CategoriaController.obtenerCategorias)

router.get("/:id",CategoriaController.obtenerCategoriaPorId)

router.post("/registrarCategoria", CategoriaController.agregarCategoria);

// router.put("/actualizarCategoria/:id", CategoriaController.editarCategoria);

// router.delete("/eliminarCategoria/:id", CategoriaController.eliminarCategoria);

export default router;
