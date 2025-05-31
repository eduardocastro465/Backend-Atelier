import { db } from "../../database/db.js";

const buscaUnCorreo = async (email) => {
  try {
    const query = {
      text: `SELECT * FROM "tblUsuarios" WHERE email = $1`,
      values: [email],
    };
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error al buscar correo:", error);
    throw new Error("Error al buscar correo en la base de datos");
  }
};

const buscarUnTelefono = async (telefono) => {
  try {
    const query = {
      text: `SELECT * FROM "tblUsuarios" WHERE telefono= $1`,
      values: [telefono]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error al buscar teléfono:", error);
    throw new Error("Error al buscar teléfono en la base de datos");
  }
}

const getUsuarioConCuenta = async (idUsuario) => {
  const query = {
    text: `
      SELECT u.*, c.*
      FROM "tblUsuarios" u
      JOIN "tblEstadoCuentas" c ON u."idEstadoCuenta" = c."idEstadoCuenta"
      WHERE u."idUsuario" = $1
    `,
    values: [idUsuario]
  };

  const { rows } = await db.query(query);
  return rows[0]; // Retorna usuario + todos los campos de cuenta
};

export const UserModel = {
  buscaUnCorreo,
  buscarUnTelefono,
  getUsuarioConCuenta
};
