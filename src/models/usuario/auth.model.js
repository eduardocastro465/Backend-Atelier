import { db } from "../../database/db.js";

const crearUsuario = async ({ nombre, email, contrasena, telefono }) => {
  try {
    const query = {
      text: `
            INSERT INTO "tblUsuarios" (correo,contrasena,nombre,telefono)
            VALUES ($1, $2, $3, $4)
            RETURNING correo,"idUsuario"
            `,
      values: [email, contrasena, nombre, telefono],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw new Error("Error al crear usuario en la base de datos");
  }
};
export const AuthModel = {
  crearUsuario,
};
