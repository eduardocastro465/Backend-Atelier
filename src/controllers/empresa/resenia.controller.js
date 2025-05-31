import { ReseniaModel } from "../../models/empresa/resenia.model.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from '../../libs/logger.js'

const crearResenia = async (req, res) => {
    try {
        const { calificacion, contenido,fecha, correo, id } = sanitizeObject(req.body);

        // Validar los datos de entrada
        if (!calificacion || !contenido || !fecha || !correo  || !id) {
            return res.status(400).json({ msg: "Faltan datos requeridos" });
        }

        console.log("Datos recibidos:", req.body);
        // Crear la reseña
        await ReseniaModel.crearResenia({
            calificacion,
            contenido,
            fecha,
            correo,
            idUsuario: id
        });

        res.status(201).json({ ok: true, msg: "reseña creada con exito" });
    } catch (error) {
        logger.error("Error al crear la reseñas:", error);
        console.log("Error al crear la reseña:", error);
        res
            .status(500)
            .json({ msg: "Error interno del servidor", error: error.message });
    }
};
const obtenerResenias = async (req, res) => {
    try {
        // const resenias = await Resenia.find();
        res.status(200).json(resenias);
    } catch (error) {
        logger.error("Error al obetner las reseñas:", error);
        res
            .status(500)
            .json({ msg: "Error interno del servidor", error: error.message });
    }
};


export const ReseniaController = {
    crearResenia
}