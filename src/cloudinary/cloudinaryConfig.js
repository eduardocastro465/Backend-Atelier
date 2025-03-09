import cloudinary from "cloudinary"
import fs from "fs-extra"
import { logger } from "../libs/logger.js"
import { CLOUDINARY_API_KEY,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_SECRET } from "../config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    await fs.unlink(filePath); // Eliminar el archivo local después de subirlo
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    logger.error("Error al subir la imagen a Cloudinary:", error);
    throw new Error("Error al subir la imagen");
  }
};

// Función para eliminar una imagen de Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error("Error al eliminar la imagen de Cloudinary:", error);
    throw new Error("Error al eliminar la imagen de Cloudinary");
  }
}

export const uploadMultipleImages = async (files, folder) => {
  if (!files || files.length === 0) {
      return [];
  }
  try {
      const uploadedImages = await Promise.all(
          files.map(async (file) => {

          const filePath = file.tempFilePath || file.path

              if (!filePath || !fs.existsSync(filePath)) {
                  console.log("El archivo no tiene una ruta válida:", filePath);
                  return null;
              }

              try {
                const result = await uploadImage(filePath, folder);
                  return result.secure_url; // Retorna la URL de la imagen subida
              } catch (error) {
                console.log("Error al subir la imagen a Cloudinary:", error);
                  return null;
              }
          })
      );

      return uploadedImages.filter(url => url !== null); // Filtra las URLs nulas
  } catch (error) {
    console.log("Error al subir múltiples imágenes a Cloudinary:", error);
      throw new Error("Error al subir múltiples imágenes");
  }
};

export const deleteTempFiles = async (files) => {
  if (!files || files.length === 0) {
    return; 
  }
  try {
    await Promise.all(
      files.map(async (file) => {

        const filePath = file.tempFilePath || file.path;

        if (!filePath) {
          return; 
        }

        try {
          // Verificar si el archivo existe antes de eliminarlo
          if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath); // Eliminar el archivo
            logger.info(`Archivo eliminado correctamente: ${filePath}`);
          } else {
            logger.warn(`El archivo no existe en la ruta: ${filePath}`);
          }
        } catch (error) {
          logger.error(`Error al eliminar el archivo ${filePath}:`, error);
          throw error; // Relanzar el error para manejarlo fuera de este bloque
        }
      })
    );
  } catch (error) {
    logger.error("Error al eliminar archivos temporales:", error);
    throw new Error("Error al eliminar archivos temporales");
  }
};