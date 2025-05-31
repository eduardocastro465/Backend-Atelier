import { VentaModel } from "../../models/venta/venta.model.js";
import { logger } from "../../libs/logger.js";
import { sanitizeObject } from "../../libs/sanitize.js";

const registrarVenta = async (req, res) => {
    try {
        const {  fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido } = sanitizeObject(req.body);

        if (!detalles || !fechaFin || !duracionDias || !estado || !montoTotal || !idRegistroPago || !idUsuario || !idVestido) {
            return res.status(400).json({ ok: false, msg: "Todos los campos son requeridos" });
        }

        const nuevaVenta = await VentaModel.createVenta({
            detalles,
            fechaFin,
            duracionDias,
            estado,
            notas,
            montoTotal,
            idRegistroPago,
            idUsuario,
            idVestido,
        });

        return res.status(201).json({ ok: true, msg: "Venta registrada con éxito", venta: nuevaVenta });
    } catch (error) {
        logger.error("Error al registrar la venta:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const actualizarVenta = async (req, res) => {
    try {
        const { id: idVenta } = req.params;

        const { detalles, fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido } = sanitizeObject(req.body);

        // Validar campos requeridos
        if (!detalles || !fechaFin || !duracionDias || !estado || !montoTotal || !idRegistroPago || !idUsuario || !idVestido) {
            return res.status(400).json({ ok: false, msg: "Todos los campos son requeridos" });
        }

        const ventaActualizada = await VentaModel.putVenta(idVenta, {
            detalles,
            fechaFin,
            duracionDias,
            estado,
            notas,
            montoTotal,
            idRegistroPago,
            idUsuario,
            idVestido,
        });

        if (!ventaActualizada) {
            return res.status(404).json({ ok: false, msg: "Venta no encontrada" });
        }

        return res.status(200).json({ ok: true, msg: "Venta actualizada con éxito", venta: ventaActualizada });
    } catch (error) {
        logger.error("Error al actualizar la venta:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const eliminarVenta = async (req, res) => {
    try {
        const { id: idVenta } = req.params;

        const ventaEliminada = await VentaModel.deteleVenta(idVenta);

        if (!ventaEliminada) {
            return res.status(404).json({ ok: false, msg: "Venta no encontrada" });
        }

        return res.status(200).json({ ok: true, msg: "Venta eliminada con éxito", venta: ventaEliminada });
    } catch (error) {
        logger.error("Error al eliminar la venta:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const obtenerVentas = async (req, res) => {
    try {
        const ventas = await VentaModel.getVentas();
        return res.status(200).json({ ok: true, ventas });
    } catch (error) {
        logger.error("Error al obtener las ventas:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const obtenerVentaPorId = async (req, res) => {
    try {
       const { id: idVenta } = req.params;

        if (!idVenta) {
            return res.status(400).json({ ok: false, msg: "El ID de venta es requerido" });
        }

        const venta = await VentaModel.getVentaPorId(idVenta);

        if (!venta) {
            return res.status(404).json({ ok: false, msg: "Venta no encontrada" });
        }

        return res.status(200).json({ ok: true, venta });
    } catch (error) {
        logger.error("Error al obtener la venta por ID:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const obtenerVentasPorEstado = async (req, res) => {
    try {
        const {  estado } = req.params;

        if (!estado) {
            return res.status(400).json({ ok: false, msg: "El estado es requerido" });
        }

        const ventas = await VentaModel.getVentasPorEstado(estado);
        return res.status(200).json({ ok: true, ventas });
    } catch (error) {
        logger.error("Error al obtener las ventas por estado:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

const obtenerVentasPorIdUsuario = async (req, res) => {
    try {

        const { id:idUsuario } = req.params;

        if (!idUsuario) {
            return res.status(400).json({ ok: false, msg: "El ID de usuario es requerido" });
        }

        const ventas = await VentaModel.getVentasPorIdUsuario(idUsuario);
        return res.status(200).json({ ok: true, ventas });
    } catch (error) {
        logger.error("Error al obtener las ventas por usuario:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};
const obtenerVentasPorIdVestido = async (req, res) => {
    try {
        const { id:idVestido } = req.params;

        if (!idVestido) {
            return res.status(400).json({ ok: false, msg: "El ID de vestido es requerido" });
        }

        const ventas = await VentaModel.getVentasPorIdVestido(idVestido);
        return res.status(200).json({ ok: true, ventas });
    } catch (error) {
        logger.error("Error al obtener las ventas por vestido:", error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor", error: error.message });
    }
};

export const VentaController = {
    registrarVenta, actualizarVenta,
    eliminarVenta, obtenerVentas,
    obtenerVentaPorId, obtenerVentasPorEstado,
    obtenerVentasPorIdUsuario, obtenerVentasPorIdVestido,
};