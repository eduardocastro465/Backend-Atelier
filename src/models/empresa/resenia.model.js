import { db } from "../../database/db.js";


const crearResenia = async ({ calificacion, contenido, fecha, correo, idUsuario }) => {
    try {
        const query = {
            text: `INSERT INTO "tblResenia"
        (calificacion, contenido, fecha, correo, estado, "idUsuario")
        VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [calificacion, contenido, fecha, correo, "pendiente", idUsuario]
        }
        const { rows } = await db.query(query);
        return rows[0];
    } catch (error) {
        console.log("Error al crear el Perfil Empresa en la base de datos: ", error)
        throw new Error("Error al crear el Perfil Empresa en la base de datos");
    }
}

export const ReseniaModel = {
    crearResenia,
}