import { db } from "../../database/db.js";

const createVenta = async ({ detalles, fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido }) => {
    try {

        await db.query('BEGIN');

        const query = {
            text: `
                INSERT INTO "tblVentas"
                ("detalles", "fechaFin", "duracionDias", "estado", "notas", "montoTotal", "idRegistroPago", "idUsuario", "idVestido")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `,
            values: [detalles, fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido],
        };

        const { rows: nuevaVenta } = await db.query(query);

        if (!nuevaVenta || nuevaVenta.length === 0) {
            throw new Error("No se pudo regitrar la venta");
        }

        await db.query('COMMIT');
        return nuevaVenta[0];
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Error al registrar la venta:", error);
        throw new Error("Error al registrar la venta");
    }
};
const putVenta = async (idVenta, { detalles, fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido }) => {
    try {

        await db.query('BEGIN');

        const query = {
            text: `
                UPDATE "tblVentas"
                SET "detalles" = $1, "fechaFin" = $2, "duracionDias" = $3, "estado" = $4, "notas" = $5, "montoTotal" = $6, "idRegistroPago" = $7, "idUsuario" = $8, "idVestido" = $9
                WHERE "idVenta" = $10
                RETURNING *
            `,
            values: [detalles, fechaFin, duracionDias, estado, notas, montoTotal, idRegistroPago, idUsuario, idVestido, idVenta],
        };

        const { rows: ventaActualizada } = await db.query(query);
        
        if (!ventaActualizada || ventaActualizada.length === 0) {
            throw new Error("No se pudo actualizar la venta");
        }

        await db.query('COMMIT');
  return ventaActualizada[0];
  
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Error al actualizar la venta:", error);
        throw new Error("Error al actualizar la venta");
    }
};

const deteleVenta = async (idVenta) => {
    try {
        await db.query('BEGIN');
        const query = {
            text: `
                UPDATE "tblVentas"
                SET "estado" = 'eliminado'
                WHERE "idVenta" = $1
                RETURNING *
            `,
            values: [idVenta],
        };

        const { rows: ventaEliminada } = await db.query(query);
        if (!ventaEliminada || ventaEliminada.length === 0) {
            throw new Error("No se pudo regitrar la venta");
        }
        await db.query('COMMIT');
        return ventaEliminada[0];
    } catch (error) {

        await db.query('ROLLBACK');
        console.error("Error al eliminar la venta:", error);
        throw new Error("Error al eliminar la venta");
    }
};

const getVentas = async () => {
    try {
        const query = {
            text: `SELECT * FROM "tblVentas"`,
        };

        const { rows: ventas } = await db.query(query);
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw new Error("Error al obtener las ventas");
    }
};
const getVentasPorIdUsuario = async (idUsuario) => {
    try {
        const query = {
            text: `SELECT * FROM "Ventas" WHERE "idUsuario" = $1`,
            values: [idUsuario],
        };

        const { rows: ventas } = await db.query(query);
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas por usuario:", error);
        throw new Error("Error al obtener las ventas por usuario");
    }
};

const getVentaPorId = async (idVenta) => {
    try {
        const query = {
            text: `SELECT * FROM "tblVentas" WHERE "idVenta" = $1`,
            values: [idVenta],
        };

        const { rows: venta } = await db.query(query);
        return venta[0]; // Retorna la primera fila (única, ya que es por ID)
    } catch (error) {
        console.error("Error al obtener la venta por ID:", error);
        throw new Error("Error al obtener la venta por ID");
    }
};


const getVentasPorIdVestido = async (idVestido) => {
    try {
        const query = {
            text: `SELECT * FROM "tblVentas" WHERE "idVestido" = $1`,
            values: [idVestido],
        };

        const { rows: ventas } = await db.query(query);
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas por vestido:", error);
        throw new Error("Error al obtener las ventas por vestido");
    }
};
const getVentasPorEstado = async (estado) => {
    try {
        const query = {
            text: `SELECT * FROM "tblVentas" WHERE "estado" = $1`,
            values: [estado],
        };

        const { rows: ventas } = await db.query(query);
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas por estado:", error);
        throw new Error("Error al obtener las ventas por estado");
    }
};

export const VentaModel = {
    createVenta, putVenta,
    deteleVenta, getVentas,
    getVentaPorId, getVentasPorEstado,
    getVentasPorIdUsuario, getVentasPorIdVestido,
}