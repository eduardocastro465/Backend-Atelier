import { UserModel } from "../../models/usuario/user.model.js";

const perfil = async (req, res) => {
  try {

    const user = await UserModel.buscaUnCorreo(req.correo);

    res.status(200).json({
      ok: true, msg: user
    });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({
      ok: false,
      mgs: "Error del servidor",
    });
  }
};

// ruta de verificacion de tipo de acceso
const VerificaTipoRolAcceso = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.user = decoded;
    next();
  });
};

export const UserController = {
  perfil,
};
