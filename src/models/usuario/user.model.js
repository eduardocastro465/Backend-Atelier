import { db } from "../../database/db.js";

const buscaUnCorreo = async (email) => {
  try {
    const query = {
      text: `SELECT * FROM "tblUsuarios" WHERE correo = $1`,
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
export const UserModel = {
  buscaUnCorreo,
  buscarUnTelefono,
};
