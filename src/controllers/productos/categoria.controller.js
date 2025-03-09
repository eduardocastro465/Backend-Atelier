import { CategoriaModel } from "../../models/productos/categoria.model.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from '../../libs/logger.js';

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaModel.obtenerCategorias();
    res.status(200).json({ ok: true, categorias });
  } catch (error) {
    logger.error("Error al obtener las categorías:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor", error: error.message });
  }
};

const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params; // ID de la categoría a buscar

    const categoria = await CategoriaModel.obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({ ok: false, message: "Categoría no encontrada." });
    }

    res.status(200).json({ ok: true, categoria });
  } catch (error) {
    logger.error("Error al obtener la categoría:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor", error: error.message });
  }
};

const agregarCategoria = async (req, res) => {
  try {

    const { categoria, descripcion } = sanitizeObject(req.body);

    if (!categoria) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio." });
    }
    if (!descripcion) {
      return res.status(400).json({ message: "La descripción de la categoría es obligatoria." });
    }

    const nuevaCategoria = await CategoriaModel.agregarCategoria({
      categoria,
      descripcion,
    });

    res.status(201).json({ ok: true, message: "Categoría creada con éxito", categoria: nuevaCategoria });
  } catch (error) {
    // Manejo de errores
    logger.error("Error al agregar la categoría:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor", error: error.message });
  }
};



export const CategoriaController = {
  obtenerCategorias,obtenerCategoriaPorId,
  agregarCategoria,
  // editarCategoria,eliminarCategoria,
};
