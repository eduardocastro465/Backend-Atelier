import { Router } from "express";
import { VentaController } from "../../controllers/renta-venta-estadisticas/ventas.controller.js";
const router = Router()

router.post("/registrar", VentaController.registrarVenta)
router.put("/actualizar/:id", VentaController.actualizarVenta)
router.delete("/eliminar", VentaController.eliminarVenta)

router.get("/obtenerVentas", VentaController.obtenerVentas)
router.get("/obtenerVentaPorId/:id", VentaController.obtenerVentaPorId)
router.get("/obtenerVentasPorEstado/:estado", VentaController.obtenerVentasPorEstado)
router.get("/obtenerVentasPorIdUsuario/:id", VentaController.obtenerVentasPorIdUsuario)
router.get("/obtenerVentasPorIdVestido/:id", VentaController.obtenerVentasPorIdVestido)

export default router;