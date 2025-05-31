import { db } from "../../database/db.js";


const obtenerCategorias = async () => {
  try {
    const query = {
      text: `SELECT * FROM "tblCategoriaVestidos"`,
    };

    const { rows: categorias } = await db.query(query);
    return categorias;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw new Error("Error al obtener las categorías");
  }
};

const obtenerCategoriaPorId = async (id) => {
  try {
    const query = {
      text: `SELECT * FROM "tblCategoriaVestidos" WHERE "idCategoriaVestidos" = $1`,
      values: [id],
    };

    const { rows: [categoria] } = await db.query(query);
    return categoria;
  } catch (error) {
    console.error("Error al obtener la categoría por ID:", error);
    throw new Error("Error al obtener la categoría por ID");
  }
};

const agregarCategoria = async ({ nombre }) => {
  try {
    const query = {
      text: `INSERT INTO "tblCategoriaVestidos" (
              "nombre"
            ) VALUES ($1) RETURNING *`,
      values: [nombre],
    };

    const { rows: [nuevaCategoria] } = await db.query(query);

    return nuevaCategoria;
  } catch (error) {
    console.error("Error al agregar la categoría:", error);
    throw new Error("Error al agregar la categoría");
  }
};

const editarCategoria = async ({ id, nombre }) => {
  try {
    const query = {
      text: `UPDATE "tblCategoriaVestidos"
             SET "nombre" = $1
             WHERE "idCategoriaVestidos" = $2
             RETURNING *`,
      values: [nombre, id],
    };

    const { rows: [categoriaActualizada] } = await db.query(query);
    return categoriaActualizada;
  } catch (error) {
    console.error("Error al editar la categoría:", error);
    throw new Error("Error al editar la categoría");
  }
};

const eliminarCategoria = async (id) => {
  try {
    const query = {
      text: `DELETE FROM "tblCategoriaVestidos"
             WHERE "idCategoriaVestidos" = $1
             RETURNING *`,
      values: [id],
    };

    const { rows: [categoriaEliminada] } = await db.query(query);
    return categoriaEliminada;
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    throw new Error("Error al eliminar la categoría");
  }
};

export const CategoriaModel = {
  agregarCategoria,
  editarCategoria,
  eliminarCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
};