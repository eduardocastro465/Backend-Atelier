import { VestidosModel } from "../../models/productos/vestidos.model.js";
import {
  deleteImage,
  uploadImage,
  uploadMultipleImages,
  deleteTempFiles,
} from "../../cloudinary/cloudinaryConfig.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { CLOUDINARY_FOLDER_PRODUCTOS, CLOUDINARY_FOLDER_ACCESORIOS } from "../../config.js";
import { logger } from "../../libs/logger.js";

const registrarVestido = async (req, res) => {
  let filesToDelete = []; // Almacenar archivos temporales

  try {
    let {
      nombre,
      color,
      precioAnterior,
      precioActual,
      mostrarPrecioAnterior,
      opcionesTipoTransaccion,
      nuevo,
      tipoCuello,
      tipoCola,
      tipoCapas,
      tipoHombro,
      descripcion,
      idCategoria
    } = sanitizeObject(req.body);
    console.log("req.body", req.files);

    if (
      !req.files ||
      !req.files.imagenes
    ) {
      return res
        .status(400)
        .json({ message: "No se ha proporcionado ninguna imagen." });
    }

    let imagenes = [];

    // Subir otras imágenes
    if (req.files.imagenes) {

      const archivos = Array.isArray(req.files.imagenes)
        ? req.files.imagenes
        : [req.files.imagenes];

      imagenes = await uploadMultipleImages(
        archivos,
        CLOUDINARY_FOLDER_PRODUCTOS
      );
      filesToDelete.push(...imagenes);
    }
    console.log("imagenes", imagenes);

    if (idCategoria === null) {
      idCategoria = 8
    }

    //Registrar el producto en la base de datos
    const vestidoRegistrado = await VestidosModel.registrarVestido({
      nombre,
      color,
      precioAnterior,
      precioActual,
      mostrarPrecioAnterior,
      opcionesTipoTransaccion,
      nuevo,
      tipoCuello,
      tipoCola,
      tipoCapas,
      tipoHombro,
      descripcion,
      idCategoriaVestidos: idCategoria,
      imagenes
    });

    // //Eliminar archivos temporales después de subirlos (lo que tiene la variable -> filesToDelete)
    await deleteTempFiles(filesToDelete);
    res
      .status(201)
      .json({
        message: "Vestido resgistrado exitosamente",
        vestidoRegistrado
      });
  } catch (error) {
    if (filesToDelete.length > 0) {
      await deleteTempFiles(filesToDelete); // Eliminar archivos temporales en caso de error
      console.log("Imagenes temporales eliminados correctamente")

      await Promise.all(
        filesToDelete.map(async (image) => {
          try {
            await deleteImage(image.public_id);
            console.log("Imagen eliminada:" + image)
          } catch (error) {
            console.log(`Error al eliminar la imagen de Cloudinary: ${image.public_id}`, error)
            logger.error(`Error al eliminar la imagen de Cloudinary: ${image.public_id}`, error);
          }
        })
      );
    }

    console.log("Error al registrar el vestido:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al registrar el vestido." });
  }
};

const actualizarVestido = async (req, res) => {
  let filesToDelete = []; // Almacenar archivos temporales

  try {
    const { id } = req.params;

    const {
      nombre,
      color,
      precioAnterior,
      precioActual,
      mostrarPrecioAnterior,
      opcionesTipoTransaccion,
      nuevo,
      tipoCuello,
      tipoCola,
      tipoCapas,
      tipoHombro,
      descripcion,
      idCategoria
    } = sanitizeObject(req.body);


    let imagenes = [];

    // Subir otras imágenes
    if (req.files.imagenes) {

      const archivos = Array.isArray(req.files.imagenes)
        ? req.files.imagenes
        : [req.files.imagenes];

      imagenes = await uploadMultipleImages(
        archivos,
        CLOUDINARY_FOLDER_PRODUCTOS
      );
      filesToDelete.push(...imagenes);
    }
    console.log("imagenes", imagenes);

    // Actualizar el producto en la base de datos
    const vestidoActualizado = await VestidosModel.editarVestido(id, {
      nombre,
      color,
      precioAnterior,
      precioActual,
      mostrarPrecioAnterior,
      opcionesTipoTransaccion,
      nuevo,
      tipoCuello,
      tipoCola,
      tipoCapas,
      tipoHombro,
      descripcion,
      idCategoriaVestidos: idCategoria,
      imagenes
    });

    if (!vestidoActualizado) {
      return res.status(404).json({ message: "Vestido no encontrado." });
    }

    // Eliminar archivos temporales después de subirlos
    await deleteTempFiles(filesToDelete);
    res.status(200).json({
      message: "Vestido actualizado exitosamente",
      vestidoActualizado,
    });
  } catch (error) {
    if (filesToDelete.length > 0) {
      await deleteTempFiles(filesToDelete); // Eliminar archivos temporales en caso de error
    }
    logger.error("Error al actualizar el vestido:", error);
    res.status(500).json({ error: "Ocurrió un error al actualizar el vestido." });
  }
};

const desactivarVestido = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar el producto de la base de datos
    const productoEliminado = await VestidosModel.eliminarVestido(id);

    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res
      .status(200)
      .json({ message: "Producto eliminado exitosamente", productoEliminado });
  } catch (error) {
    logger.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al eliminar el producto." });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await VestidosModel.obtenerVestidos();
    res.status(200).json(productos);
  } catch (error) {
    logger.error("Error al obtener los productos:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los productos." });
  }
};

const obtenerProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await VestidosModel.obtenerVestidoPorId(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json({ producto });
  } catch (error) {
    logger.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener el producto." });
  }
};

const buscarVestidos = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        message: "Término de búsqueda muy corto.",
      });
    }

    const resultados = await VestidosModel.buscarVestidos(query);

    if (resultados.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos.",
        resultados: [],
      });
    }

    res.status(200).json({
      total: resultados.length,
      resultados,
    });
  } catch (error) {
    logger.error("Error en la búsqueda de productos:", error);
    res.status(500).json({
      message: "Ocurrió un error al buscar productos.",
      error: error.message,
    });
  }
};

const buscarProductosAvanzados = async (req, res) => {
  try {
    const filtros = req.body || {};

    const resultados = await VestidosModel.buscarVestidosAvanzados(filtros);

    res.status(200).json({
      total: resultados.length,
      resultados,
    });
  } catch (error) {
    logger.error("Error en la búsqueda avanzada de productos:", error);
    res.status(500).json({
      message: "Ocurrió un error al buscar productos.",
      error: error.message,
    });
  }
};

export const VestidosController = {
  registrarVestido,
  actualizarVestido,
  desactivarVestido,
  obtenerProductos,
  obtenerProductoById,
  buscarVestidos,
  buscarProductosAvanzados,
};
