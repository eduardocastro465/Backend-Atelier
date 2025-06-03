import { db } from "../../database/db.js";

const registrarVestido = async ({
  nombre,
  color,
  precioAnterior,
  precioActual,
  mostrarPrecioAnterior,
  opcionesTipoTransaccion,
  nuevo,
  tipoCuello,
  tipoCola,
  tipoCapas,
  tipoHombro,
  descripcion,
  idCategoriaVestidos,
  imagenes
}) => {

  console.log("imagenes", imagenes);
  await db.query('BEGIN');


  try {
    // Insertar imágenes en tblVestidosImagenes
    const { rows: [imagen] } = await db.query(
      `INSERT INTO "tblVestidosImagenes" (
        "imagen1", "imagen2", "imagen3", "imagen4",
        "imagen5", "imagen6", "imagen7", "imagen8"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING "idVestidosImagenes"`,
      [
        imagenes[0] || "",
        imagenes[1] || "",
        imagenes[2] || "",
        imagenes[3] || "",
        imagenes[4] || "",
        imagenes[5] || "",
        imagenes[6] || "",
        imagenes[7] || ""
      ]
    );


    // Insertar el vestido en tblVestidos usando el idVestidosImag
    const {
      rows: [vestido],
    } = await db.query(
      `INSERT INTO "tblProducto" (
  nombre, descripcion, color, "precioAnterior", "precioActual", "mostrarPrecioAnterior",
  "opcionesTipoTransaccion", nuevo, "tipoCuello", "tipoCola", "tipoCapas", "tipoHombro",
  "idCategoriaVestidos", "idVestidosImagenes"
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
) RETURNING *
`,
      [
        nombre,
        descripcion,
        color,
        precioAnterior,
        precioActual,
        mostrarPrecioAnterior,
        opcionesTipoTransaccion,
        nuevo,
        tipoCuello,
        tipoCola,
        tipoCapas,
        tipoHombro,
        idCategoriaVestidos,
        imagen.idVestidosImagenes,
      ]
    );

    await db.query('COMMIT'); // Confirmar la transacción
    return vestido;
  } catch (error) {
    await db.query('ROLLBACK');
    console.error("Error al registrar el vestido:", error);
    throw new Error("Error al registrar el vestido");
  }
};

const editarVestido = async (id, {
  nombre,
  color,
  precioAnterior,
  precioActual,
  mostrarPrecioAnterior,
  opcionesTipoTransaccion,
  nuevo,
  tipoCuello,
  tipoCola,
  tipoCapas,
  tipoHombro,
  descripcion,
  idCategoriaVestidos: idCategoria,
  imagenes }) => {
  try {

    await db.query('BEGIN');

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
    // 2. Insertar el vestido en tabla de productos
    const { rows: [vestido] } = await db.query(
      `INSERT INTO "tblProducto" (
        nombre, descripcion, color, "precioAnterior", "precioActual", "mostrarPrecioAnterior",
        "opcionesTipoTransaccion", nuevo, "tipoCuello", "tipoCola", "tipoCapas", "tipoHombro",
        "idCategoriaVestidos", "idVestidosImagenes", "fechaRegistro"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
      ) RETURNING *`,
      [
        nombre,
        descripcion,
        color,
        precioAnterior,
        precioActual,
        mostrarPrecioAnterior,
        opcionesTipoTransaccion,
        nuevo,
        tipoCuello,
        tipoCola,
        tipoCapas,
        tipoHombro,
        idCategoriaVestidos,
        imagen.idVestidosImagenes
      ]
    );

    await db.query('COMMIT'); // Confirmar la transacción
    return vestido;

  } catch (error) {
    await db.query('ROLLBACK');
    console.error("Error al editar el vestido:", error);
    throw new Error("Error al editar el vestido");
  }
};

const eliminarVestido = async (id) => {

  await db.query('BEGIN');


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

    await db.query('COMMIT'); // Confirmar la transacción
    await db.query(queryEliminarImagenes);
    return vestidoEliminado;
  } catch (error) {
    await db.query('ROLLBACK');
    console.error("Error al eliminar el vestido:", error);
    throw new Error("Error al eliminar el vestido");
  }
};

const obtenerVestidos = async () => {
  try {
    const { rows } = await db.query({
      text: `
        SELECT 
          p."idProducto" AS _id,
          p.nombre,
          c.nombre AS categoria,
          p.color,
          p."opcionesTipoTransaccion",
          p."precioActual",
          p."precioAnterior",
          p.disponible,
          p.nuevo,
       
          p.altura,
          p.cintura,
          p.textura,
          i.imagen1, i.imagen2, i.imagen3, i.imagen4,
          i.imagen5, i.imagen6, i.imagen7, i.imagen8
        FROM "tblProducto" p
        JOIN "tblVestidosImagenes" i ON p."idVestidosImagenes" = i."idVestidosImagenes"
        JOIN "tblCategoriaVestidos" c ON p."idCategoriaVestidos" = c."idCategoriaVestidos"
      `
    });

    return rows.map(row => ({
      ...row,
      imagenes: [
        row.imagen1, row.imagen2, row.imagen3, row.imagen4,
        row.imagen5, row.imagen6, row.imagen7, row.imagen8
      ].filter(Boolean),
      precioAnterior: row.precioAnterior || undefined,
      disponible: row.disponible ?? true,
      talla: row.talla || undefined,
      altura: row.altura || undefined,
      cintura: row.cintura || undefined,
      textura: row.textura || undefined
    }));
  } catch (error) {
    console.error("Error al obtener vestidos:", error);
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
