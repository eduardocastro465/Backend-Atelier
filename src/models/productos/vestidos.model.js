import { db } from "../../database/db.js";

const registrarVestido = async (vestidoData) => {
  const {
    nombre,
    descripcion,
    urlVestidoPrincipal,
    otrasImagenesSubidas, // Array de otras imágenes (máximo 7)
    color,
    textura,
    talla,
    altura,
    cintura,
    precio,
    estado,
    nuevo,
    categoria,
  } = vestidoData;

  //No registrado

  try {
    // Insertar imágenes en tb/VestidosImagenes
    const {
      rows: [imagen],
    } = await db.query(
      `INSERT INTO "tblVestidosImagenes" (
        "imagen1", "imagen2", "imagen3", "imagen4", 
        "imagen5", "imagen6", "imagen7", "imagen8"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "idVestidosImagenes"`,
      [
        urlVestidoPrincipal,
        otrasImagenesSubidas[0] || "", // imagen2
        otrasImagenesSubidas[1] || "", // imagen3
        otrasImagenesSubidas[2] || "", // imagen4
        otrasImagenesSubidas[3] || "", // imagen5
        otrasImagenesSubidas[4] || "", // imagen6
        otrasImagenesSubidas[5] || "", // imagen7
        otrasImagenesSubidas[6] || "", // imagen8
      ]
    );

    // Insertar el vestido en tblVestidos usando el idVestidosImag
    const {
      rows: [vestido],
    } = await db.query(
      `INSERT INTO "tblVestidos" (
        nombre, descripcion, color, textura, talla, altura_cm, cintura_cm, precio, 
        estado, nuevo, "fechaDeCreacion", "idCategoriaVestidos", "idVestidosImagenes"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12) RETURNING *`,
      [
        nombre,
        descripcion,
        color,
        textura,
        talla,
        altura,
        cintura,
        precio,
        estado,
        nuevo,
        categoria,
        imagen.idVestidosImagenes, // ID de las imágenes insertadas
      ]
    );

    return vestido;
  } catch (error) {
    console.error("Error al registrar el vestido:", error);
    throw new Error("Error al registrar el vestido");
  }
};

const editarVestido = async (id, vestidoData) => {
  try {
    if (vestidoData.urlVestidoPrincipal || vestidoData.otrasImagenesSubidas) {
      const queryImagenes = {
        text: `UPDATE "tblVestidosImagenes"
               SET "imagen1" = $1, "imagen2" = $2, "imagen3" = $3, "imagen4" = $4,
                   "imagen5" = $5, "imagen6" = $6, "imagen7" = $7, "imagen8" = $8
               WHERE "idVestidosImagenes" = $9
               RETURNING *`,
        values: [
          vestidoData.urlVestidoPrincipal || "", // imagen1 (imagen principal)
          vestidoData.otrasImagenesSubidas[0] || "", // imagen2
          vestidoData.otrasImagenesSubidas[1] || "", // imagen3
          vestidoData.otrasImagenesSubidas[2] || "", // imagen4
          vestidoData.otrasImagenesSubidas[3] || "", // imagen5
          vestidoData.otrasImagenesSubidas[4] || "", // imagen6
          vestidoData.otrasImagenesSubidas[5] || "", // imagen7
          vestidoData.otrasImagenesSubidas[6] || "", // imagen8
          vestidoData.idVestidosImagenes, // ID de las imágenes
        ],
      };

      await db.query(queryImagenes);
    }
    const query = {
      text: `UPDATE "tblVestidos"
             SET nombre = $1, descripcion = $2, 
                 color = $3, textura = $4, talla = $5, altura_cm = $6, cintura_cm = $7,
                 precio = $8, disponible = $9, nuevo = $10, "idCategoriaVestidos" = $11
             WHERE "idVestido" = $12
             RETURNING *`,
      values: [
        vestidoData.nombre,
        vestidoData.descripcion,
        vestidoData.color,
        vestidoData.textura,
        vestidoData.talla,
        vestidoData.altura,
        vestidoData.cintura,
        vestidoData.precio,
        vestidoData.estado,
        vestidoData.nuevo,
        vestidoData.categoria,
        id,
      ],
    };

    const {
      rows: [vestidoActualizado],
    } = await db.query(query);
    return vestidoActualizado;
  } catch (error) {
    console.error("Error al editar el vestido:", error);
    throw new Error("Error al editar el vestido");
  }
};

const eliminarVestido = async (id) => {
  try {
    const queryObtenerImagenes = {
      text: `SELECT "idVestidosImagenes" FROM "tblVestidos" WHERE "idVestido" = $1`,
      values: [id],
    };

    const {
      rows: [vestido],
    } = await db.query(queryObtenerImagenes);

    if (!vestido) {
      throw new Error("Vestido no encontrado.");
    }

    const { idVestidosImagenes, idAccesorio } = vestido;

    // Eliminar el vestido
    const queryEliminarVestido = {
      text: `DELETE FROM "tblVestidos" WHERE "idVestido" = $1 RETURNING *`,
      values: [id],
    };

    const {
      rows: [vestidoEliminado],
    } = await db.query(queryEliminarVestido);

    // Eliminar las imágenes relacionadas
    const queryEliminarImagenes = {
      text: `DELETE FROM "tblVestidosImagenes" WHERE "idVestidosImagenes" = $1 RETURNING *`,
      values: [idVestidosImagenes],
    };

    if (idAccesorio) {
      const queryActualizarAccesorio = {
        text: `UPDATE "tblAccessorios" SET estado = 'disponible' WHERE "idAccessorio" = $1 RETURNING *`,
        values: [idAccesorio],
      };

      await db.query(queryActualizarAccesorio);
    }

    await db.query(queryEliminarImagenes);
    return vestidoEliminado;
  } catch (error) {
    console.error("Error al eliminar el vestido:", error);
    throw new Error("Error al eliminar el vestido");
  }
};

const obtenerVestidos = async () => {
  try {
    const query = {
      text: `SELECT * FROM "tblVestidos"`,
    };

    const { rows: vestidos } = await db.query(query);
    return vestidos;
  } catch (error) {
    console.error("Error al obtener los vestidos:", error);
    throw new Error("Error al obtener los vestidos");
  }
};

const obtenerVestidoPorId = async (id) => {
  try {
    const query = {
      text: `SELECT * FROM "tblVestidos" WHERE "idVestido" = $1`,
      values: [id],
    };

    const {
      rows: [vestido],
    } = await db.query(query);
    return vestido;
  } catch (error) {
    console.error("Error al obtener el vestido por ID:", error);
    throw new Error("Error al obtener el vestido por ID");
  }
};

const buscarVestidos = async (query) => {
  try {
    const searchQuery = `%${query}%`;
    const sqlQuery = {
      text: `SELECT * FROM "tblVestidos"
             WHERE nombre ILIKE $1 OR descripcion ILIKE $1 OR color ILIKE $1 OR textura ILIKE $1`,
      values: [searchQuery],
    };

    const { rows: vestidos } = await db.query(sqlQuery);
    return vestidos;
  } catch (error) {
    console.error("Error al buscar vestidos:", error);
    throw new Error("Error al buscar vestidos");
  }
};

const buscarVestidosAvanzados = async (filtros) => {
  try {
    let query = `SELECT * FROM "tblVestidos" WHERE 1 = 1`;
    const values = [];
    let index = 1;

    if (filtros.categoria) {
      query += ` AND "idCategoria" = $${index}`;
      values.push(filtros.categoria);
      index++;
    }

    if (filtros.color) {
      query += ` AND color = $${index}`;
      values.push(filtros.color);
      index++;
    }

    if (filtros.talla) {
      query += ` AND talla = $${index}`;
      values.push(filtros.talla);
      index++;
    }

    const { rows: vestidos } = await db.query(query, values);
    return vestidos;
  } catch (error) {
    console.error("Error al buscar vestidos avanzados:", error);
    throw new Error("Error al buscar vestidos avanzados");
  }
};

export const VestidosModel = {
  registrarVestido,
  editarVestido,
  eliminarVestido,
  obtenerVestidos,
  obtenerVestidoPorId,
  buscarVestidos,
  buscarVestidosAvanzados,
};
