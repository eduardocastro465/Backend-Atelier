import { db } from '../../database/db.js'

const obtenerPerfilEmpresaPorId = async (id) => {
    try {
        const query = {
            text: `SELECT * FROM "tblDatosEmpresa"
                   WHERE id = $1`,
            values: [id],
        };
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            throw new Error("Perfil de empresa no encontrado");
        }
        return rows[0];
    } catch (error) {
        console.error("Error al obtener el Perfil Empresa por ID: ", error);
        throw new Error("Error al obtener el Perfil Empresa por ID");
    }
}

const obtenerPerfilEmpresaConRedesSociales = async () => {
    try {
        const query = {
            text: `SELECT de.*, rs.* 
                   FROM "tblDatosEmpresa" de
                   LEFT JOIN "tblRedesSociales" rs ON de.id = rs.empresa_id`,
        };
        const { rows } = await db.query(query);
  
        if (rows.length === 0) {
            throw new Error("Perfil de empresa no encontrado");
        }
  
        const perfilEmpresa = {
            ...rows[0],
            redesSociales: rows.map(row => ({
                id: row.id,
                plataforma: row.plataforma,
                enlace: row.enlace,
            })),
        };
  
        return perfilEmpresa;
    } catch (error) {
        console.error("Error al obtener el perfil de la empresa con redes sociales: ", error);
        throw new Error("Error al obtener el perfil de la empresa con redes sociales");
    }
  };

const crearPerfilEmpresa = async ({ logo, slogan, nombre, direccion, correo, telefono }) => {
    try {
        const query = {
            text: `INSERT INTO "tblDatosEmpresa"
        (logo, slogan, nombre, direccion, correo, telefono)
        VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [logo, slogan, nombre, direccion, correo, telefono]
        }
        const { rows } = await db.query(query);
        return rows[0];
    } catch (error) {
        console.log("Error al crear el Perfil Empresa en la base de datos: ", error)
        throw new Error("Error al crear el Perfil Empresa en la base de datos");
    }
}
const actualizarPerfilEmpresa = async (perfilEmpresa) => {
    try {
        const { id, logo, slogan, nombre, direccion, correo, telefono } = perfilEmpresa;

        const query = {
            text: `UPDATE "tblDatosEmpresa"
                   SET logo = $1, slogan = $2, nombre = $3, direccion = $4, correo = $5, telefono = $6
                   WHERE id = $7
                   RETURNING *`,
            values: [logo, slogan, nombre, direccion, correo, telefono, id],
        };
        const { rows } = await db.query(query);

        if (rows.length === 0) {
            throw new Error("Perfil de empresa no encontrado");
        }

        return rows[0];
    } catch (error) {
        console.error("Error al actualizar el perfil de la empresa: ", error);
        throw new Error("Error al actualizar el perfil de la empresa");
    }
};

const eliminarPerfilEmpresa = async (id) => {
    try {
        const query = {
            text: `DELETE FROM "tblDatosEmpresa"
                   WHERE id = $1
                   RETURNING *`,
            values: [id],
        };
        const { rows } = await db.query(query);
        if (rows.length === 0) {
            throw new Error("No se encontró el perfil de la empresa con el ID proporcionado");
        }
        return rows[0];
    } catch (error) {
        console.error("Error al eliminar el Perfil Empresa en la base de datos: ", error);
        throw new Error("Error al eliminar el Perfil Empresa en la base de datos");
    }
};

const guardarRedesSociales = async ({ plataforma, enlace }) => {
    try {
        const query = {
            text: `INSERT INTO "tblRedesSociales"
        (plataforma,enlace)
        VALUES ($1, $2,)`,
            values: [plataforma, enlace]
        }
        const { rows } = await db.query(query);
        return rows[0];
    } catch (error) {
        console.error("Error al guardar las redes sociales en la base de datos: ", error);
        throw new Error("Error al guardar las redes sociales en la base de datos");
    }
}

const eliminarRedSocial = async (id) => {
    try {
        const query = {
            text: `DELETE FROM "tblRedesSociales"
                   WHERE id = $1
                   RETURNING *`,
            values: [id],
        };
        const { rows } = await db.query(query);

        if (rows.length === 0) {
            throw new Error("Red social no encontrada");
        }

        return rows[0];
    } catch (error) {
        console.error("Error al eliminar la red social: ", error);
        throw new Error("Error al eliminar la red social");
    }
};
export const EmpresaModel = {
    obtenerPerfilEmpresaPorId,
    obtenerPerfilEmpresaConRedesSociales,
    crearPerfilEmpresa,
    actualizarPerfilEmpresa,
    eliminarPerfilEmpresa,
    guardarRedesSociales,
    eliminarRedSocial,
}