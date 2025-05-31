import { RentaModel } from "../../models/renta/consultarRentasModel.js";
import { logger } from "../../libs/logger.js";


const crearRenta = async (req, res) => {
    try {
        
        const {anticipo,montoPagado,totalAPagar,pagosRealizados} = req.body;
        const rentaData = req.body;
        const idRenta = await RentaModel.createRenta(rentaData);
        res.status(201).json({ idRenta });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const actualizarRenta = async (req, res) => {
    try {
        const { id } = req.params;
        const rentaData = req.body;
        const affectedRows = await RentaModel.updateRenta(id, rentaData);
        if (affectedRows > 0) {
            res.status(200).json({ message: "Renta actualizada" });
        } else {
            res.status(404).json({ message: "Renta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const eliminarRenta = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await RentaModel.deleteRenta(id);
        if (affectedRows > 0) {
            res.status(200).json({ message: "Renta eliminada" });
        } else {
            res.status(404).json({ message: "Renta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// Controlador para obtener todas las rentas
 const obtenerTodasLasRentas = async (req, res) => {
    try {
        const rentas = await RentaModel.getRentas();
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una renta por ID
 const obtenerRentaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const renta = await RentaModel.getRentaPorId(id);
        if (renta) {
            res.status(200).json(renta);
        } else {
            res.status(404).json({ message: "Renta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por ID de usuario
 const obtenerRentasPorIdUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const rentas = await RentaModel.getRentasPorIdUsuario(idUsuario);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por ID de vestido
 const obtenerRentasPorIdVestido = async (req, res) => {
    try {
        const { idVestido } = req.params;
        const rentas = await RentaModel.getRentasPorIdVestido(idVestido);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por estado
 const obtenerRentasPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const rentas = await RentaModel.getRentasPorEstado(estado);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener detalles de renta por ID
 const obtenerDetalleRentaPorId = async (req, res) => {
    try {
        const { idDetalleRenta } = req.params;
        const detalleRenta = await RentaModel.getDetalleRentaPorId(idDetalleRenta);
        if (detalleRenta) {
            res.status(200).json(detalleRenta);
        } else {
            res.status(404).json({ message: "Detalle de renta no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por ID de detalle de renta
 const obtenerRentasPorIdDetalleRenta = async (req, res) => {
    try {
        const { idDetalleRenta } = req.params;
        const rentas = await RentaModel.getRentasPorIdDetalleRenta(idDetalleRenta);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por fecha de registro
 const obtenerRentasPorFechaRegistro = async (req, res) => {
    try {
        const { fechaRegistro } = req.params;
        const rentas = await RentaModel.getRentasPorFechaRegistro(fechaRegistro);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas por método de pago
 const obtenerRentasPorMetodoDePago = async (req, res) => {
    try {
        const { metodoDePago } = req.params;
        const rentas = await RentaModel.getRentasPorMetodoDePago(metodoDePago);
        res.status(200).json(rentas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener rentas con detalles
 const obtenerRentasConDetalles = async (req, res) => {
    try {
        const rentasConDetalles = await RentaModel.getRentasConDetalles();
        res.status(200).json(rentasConDetalles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const RentaController = {
    obtenerTodasLasRentas,obtenerRentaPorId,
    obtenerRentasPorIdUsuario,obtenerRentasPorIdVestido,
    obtenerRentasPorEstado,obtenerDetalleRentaPorId,
    obtenerRentasPorIdDetalleRenta,obtenerRentasPorFechaRegistro,
    obtenerRentasPorMetodoDePago,obtenerRentasConDetalles,
};