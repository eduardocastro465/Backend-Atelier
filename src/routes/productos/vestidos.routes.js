import { Router } from "express";
import { VestidosController } from "../../controllers/productos/vestidos.controller.js";
import fileUploadMiddleware  from "../../middlewares/fileUploadMiddleware.js";

const router = Router();
;
router.get("/obtenerProductos", VestidosController.obtenerProductos);

router.get("/obtenerProductoById/:id", VestidosController.obtenerProductoById);

router.post(
  "/",
  fileUploadMiddleware,
  VestidosController.registrarVestido
);

router.put(
  "/editarProducto/:id",
  fileUploadMiddleware,
  VestidosController.actualizarVestido
);

router.delete("/eliminarProducto/:id", VestidosController.desactivarVestido);

router.get("/buscarVestidos/:query", VestidosController.buscarVestidos);

router.post(
  "/buscarProductosAvanzados",
  VestidosController.buscarProductosAvanzados
);

export default router;
