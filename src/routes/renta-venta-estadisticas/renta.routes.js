import { Router } from "express";
import { RentaController } from "../../controllers/renta-venta-estadisticas/rentas.controller.js";
const router = Router()


// router.post("/registrar", RentaController.registrarVenta)
// router.put("/actualizar/:id", RentaController.actualizarVenta)
// router.delete("/eliminar", RentaController.eliminarVenta)


router.get('/rentas', RentaController.obtenerTodasLasRentas);
router.get('/rentas/:id', RentaController.obtenerRentaPorId);
router.get('/rentas/usuario/:idUsuario', RentaController.obtenerRentasPorIdUsuario);
router.get('/rentas/vestido/:idVestido', RentaController.obtenerRentasPorIdVestido);
router.get('/rentas/estado/:estado', RentaController.obtenerRentasPorEstado);
router.get('/detalle-renta/:idDetalleRenta', RentaController.obtenerDetalleRentaPorId);
router.get('/rentas/detalle/:idDetalleRenta', RentaController.obtenerRentasPorIdDetalleRenta);
router.get('/rentas/fecha/:fechaRegistro', RentaController.obtenerRentasPorFechaRegistro);
router.get('/rentas/metodo-pago/:metodoDePago', RentaController.obtenerRentasPorMetodoDePago);
router.get('/rentas-con-detalles', RentaController.obtenerRentasConDetalles);


export default router;