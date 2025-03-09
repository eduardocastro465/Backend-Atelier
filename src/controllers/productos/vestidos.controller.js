import { VestidosModel } from "../../models/productos/vestidos.model.js";
import {
  deleteImage,
  uploadImage,
  uploadMultipleImages,
  deleteTempFiles,
} from "../../cloudinary/cloudinaryConfig.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from "../../libs/logger.js";

const registrarVestido = async (req, res) => {
  let filesToDelete = []; // Almacenar archivos temporales

  try {
    let {
      nombre,
      categoria,
      color,
      textura,
      talla,
      altura,
      cintura,
      precio,
      estado,
      nuevo,
      descripcion,
    } = sanitizeObject(req.body);

    if (
      !req.files ||
      !req.files.imagenPrincipal ||
      req.files.imagenPrincipal.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "No se ha proporcionado una imagen principal." });
    }


    const imagenPrincipalFile = req.files.imagenPrincipal?.path || req.files.imagenPrincipal?.tempFilePath ;

    // Subir la imagen principal a Cloudinary
    const imagenSubida = await uploadImage(imagenPrincipalFile,
      {folder: process.env.CLOUDINARY_FOLDER_PRODUCTOS,
      }
    );
    console.log(imagenSubida)
    filesToDelete.push(imagenSubida); // Agregamos a la lista de eliminación

    let otrasImagenesSubidas = [];

    // Subir otras imágenes (si existen)
    if (req.files.otrasImagenes && Array.isArray(req.files.otrasImagenes)) {
      otrasImagenesSubidas = await uploadMultipleImages(
        req.files.otrasImagenes,
        process.env.CLOUDINARY_FOLDER_PRODUCTOS
      );
      filesToDelete.push(...otrasImagenesSubidas);
    }

    altura = 10;
    cintura = 10;
    precio = 10;
    nuevo = true;
    // categoria = 1;

    // Registrar el producto en la base de datos
    const vestidoRegistrado = await VestidosModel.registrarVestido({
      nombre,
      descripcion,
      urlVestidoPrincipal: imagenSubida.secure_url,
      otrasImagenesSubidas,
      color,
      textura,
      talla,
      altura,
      cintura,
      precio,
      estado,
      nuevo,
      categoria,
    });

    //Eliminar archivos temporales después de subirlos (lo que tiene la variable -> filesToDelete)
    await deleteTempFiles(filesToDelete);
    res
      .status(201)
      .json({ message: "Vestido resgistrado exitosamente", vestidoRegistrado });
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
    // const id = 5;
    // const categoria = 1;
    // const cintura = 10;
    // const precio = 10;
    // const altura = 10;
    //nuevo = true;

    const {
      nombre,
      categoria,
      cintura,
      precio,
      altura,
      color,
      textura,
      talla,
      estado,
      nuevo,
      // : nuevoRaw = true
      descripcion,
      idVestidosImagenes,
      // : idVestidosImagenesRaw = 3
    } = sanitizeObject(req.body);

    // const idVestidosImagenes = parseInt(idVestidosImagenesRaw);

    let urlVestidoPrincipal;
    let otrasImagenesSubidas = [];

    // Subir la nueva imagen principal si se proporciona
    if (req.files?.imagenPrincipal) {
      const imagenPrincipalFile = req.files.imagenPrincipal;
      const { secure_url } = await uploadImage(
        imagenPrincipalFile.path || imagenPrincipalFile.tempFilePath,
        {
          folder: process.env.CLOUDINARY_FOLDER_PRODUCTOS,
        }
      );
      urlVestidoPrincipal = secure_url;
      filesToDelete.push(imagenPrincipalFile);
    }

    // Subir otras imágenes si se proporcionan
    if (req.files?.otrasImagenes && Array.isArray(req.files.otrasImagenes)) {
      otrasImagenesSubidas = await uploadMultipleImages(
        req.files.otrasImagenes,
        process.env.CLOUDINARY_FOLDER_PRODUCTOS
      );
      filesToDelete.push(...req.files.otrasImagenes);
    }

    // Actualizar el producto en la base de datos
    const vestidoActualizado = await VestidosModel.editarVestido(id, {
      nombre,
      descripcion,
      urlVestidoPrincipal,
      otrasImagenesSubidas,
      color,
      textura,
      talla,
      altura,
      cintura,
      precio,
      estado,
      nuevo,
      categoria,
      idVestidosImagenes,
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
    res.status(200).json({ productos });
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
