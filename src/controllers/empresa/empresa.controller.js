import fs from 'fs-extra'
import { EmpresaModel } from "../../models/empresa/empresa.model.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from '../../libs/logger.js'
import { deleteImage, uploadImage } from "../../cloudinary/cloudinaryConfig.js"

const crearPerfilEmpresa = async (req, res) => {
  try {

    const {
      slogan, tituloPagina,
      direccion, correoElectronico, telefono } = sanitizeObject(req.body);


    if (!direccion) return res.status(400).json({ message: "Dirección vacía" });
    if (!correoElectronico)
      return res.status(400).json({ message: "Correo electrónico vacío" });

    if (!req.files?.logo) {
      return res.status(400).json({ mensaje: "No se proporcionó un logo para subir" });
    }

    //subir el logo a cloudinary
    const { logo } = req.files;
    console.log(logo)

    const { secure_url } = await uploadImage(logo.tempFilePath || logo.path);

    //eliminar el archivo temporal cuando ya se alla subido
    try {
      await fs.unlink(logo.tempFilePath || logo.path);
    } catch (error) {
      logger.error("Error al eliminar el archivo temporal:", error);
    }

    await EmpresaModel.crearPerfilEmpresa({
      logo: secure_url, slogan, nombre: tituloPagina,
      direccion, correo: correoElectronico, telefono
    });

    res.status(201).json({ ok: true, msg: "perfil creado con escito" });
  } catch (error) {
    logger.error("Error al crear el perfil de la empresa:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor", error: error.message });
  }
};

const eliminarPerfilEmpresa = async (req, res) => {
  try {

    const { id } = req.params;
    const perfil = await EmpresaModel.obtenerPerfilEmpresaPorId(id);
    console.log(perfil)
    if (!perfil) {
      return res.status(404).json({ ok: false, msg: "Perfil de empresa no encontrado" });
    }

    if (perfil.logo) {
      await deleteImage(perfil.logo);
    }

    await EmpresaModel.eliminarPerfilEmpresa(id);

    res.status(200).json({ ok: true, msg: "Perfil eliminado con éxito" });
  } catch (error) {
    logger.error("Error al eliminar el perfil de la empresa:", error);
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};


const guardarRedSocial = async (req, res) => {
  try {
    const { enlace, plataforma } = sanitizeObject(req.body);

    const redSocial = await EmpresaModel.guardarRedesSociales({
      enlace, plataforma
    });
    console.log(redSocial);

    // const perfil = await EmpresaModel.obtenerPerfilEmpresaPorId(1);
    // console.log(perfil);

    // if (!perfilEmpresa) {
    //   logger.error("Perfil de empresa no encontrado");
    //   return res
    //     .status(404)
    //     .json({ error: "Perfil de empresa no encontrado." });
    // }

    // perfilEmpresa[0].redesSociales.push(redSocialGuardada._id);

    // await perfilEmpresa[0].save();
    return res
      .status(200)
      .json({ message: "Red social guardada correctamente." });
  } catch (error) {
    logger.error("Error al guardar la red social:", error);
    return res.status(500).json({ error: "Error al guardar la red social." });
  }
};
const obtenerRedesSociales = async (req, res) => {
  try {
    const perfilEmpresa = await EmpresaModel.obtenerPerfilEmpresaConRedesSociales();

    if (!perfilEmpresa) {
      logger.error("Perfil de empresa no encontrado");
      return res.status(404).json({ error: "Perfil de empresa no encontrado." });
    }

    const redesSociales = perfilEmpresa.redesSociales;

    return res.status(200).json({ redesSociales });
  } catch (error) {
    logger.error("Error al obtener las redes sociales:", error);
    return res.status(500).json({ error: "Error al obtener las redes sociales." });
  }
};

const eliminarRedSocial = async (req, res) => {
  try {
    const { id } = req.params;

    const perfilEmpresa = await EmpresaModel.obtenerPerfilEmpresaConRedesSociales();

    if (!perfilEmpresa || !perfilEmpresa.redesSociales || perfilEmpresa.redesSociales.length === 0) {
      logger.error("Perfil de empresa o redes sociales no encontradas");
      return res.status(404).json({ error: "Perfil de empresa o redes sociales no encontradas." });
    }

    const redSocialIndex = perfilEmpresa.redesSociales.findIndex(
      (red) => red._id.toString() === id
    );

    if (redSocialIndex === -1) {
      logger.error("Red social no encontrada");
      return res.status(404).json({ error: "Red social no encontrada." });
    }

    perfilEmpresa.redesSociales.splice(redSocialIndex, 1);

    await EmpresaModel.eliminarRedSocial(id);

    await EmpresaModel.actualizarPerfilEmpresa(perfilEmpresa);

    return res.status(200).json({ message: "Red social eliminada correctamente." });
  } catch (error) {
    logger.error("Error al eliminar la red social:", error);
    return res.status(500).json({ error: "Error al eliminar la red social." });
  }
};

export const EmpresaController = {
  crearPerfilEmpresa,
  eliminarPerfilEmpresa,
  guardarRedSocial,
  obtenerRedesSociales,
  eliminarRedSocial,
}