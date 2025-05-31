// import { db } from "../../database/db.js";

const registrarVenta = async (ventaData) => {
    try {
        await db.query('BEGIN');

        const { idUsuario, idVestido, estado, notas, idDetalleRenta } = ventaData;

        // Insertar en tblRentas
        const queryRenta = {
            text: `
                INSERT INTO "tblRentas" ("idUsuario", "idVestido", "estado", "notas", "idDetalleRenta")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `,
            values: [idUsuario, idVestido, estado, notas, idDetalleRenta],
        };

        const { rows: nuevaVenta } = await db.query(queryRenta);

        const queryDetalle = {
            text: `
                UPDATE "tbDetaileRenta"
                SET "montoPagado" = "montoPagado" + $1
                WHERE "idDetalleRenta" = $2
            `,
            values: [100, idDetalleRenta],
        };
        await db.query(queryDetalle);

        await db.query('COMMIT'); 
        return nuevaVenta[0];
    } catch (error) {
        await db.query('ROLLBACK'); 
        throw new Error("Error al registrar la venta: " + error.message);
    } finally {
        db.release(); 
    }
};

const actualizarVenta = async (id, ventaData) => {
  
    try {
        await db.query('BEGIN'); // Iniciar la transacción

        const { idUsuario, idVestido, estado, notas, idDetalleRenta } = ventaData;
s
        const queryRenta = {
            text: `
                UPDATE "tblRentas"
                SET "idUsuario" = $1, "idVestido" = $2, "estado" = $3, "notas" = $4, "idDetalleRenta" = $5
                WHERE "idRenta" = $6
                RETURNING *
            `,
            values: [idUsuario, idVestido, estado, notas, idDetalleRenta, id],
        };

        const { rows: ventaActualizada } = await db.query(queryRenta);

        const queryDetalle = {
            text: `
                UPDATE "tblDetalleRenta"
                SET "montoPagado" = "montoPagado" + $1
                WHERE "idDetalleRenta" = $2
            `,
            values: [50, idDetalleRenta], 
        };
        await db.query(queryDetalle);

        await db.query('COMMIT'); 
        return ventaActualizada[0];
    } catch (error) {
        await db.query('ROLLBACK'); 
        throw new Error("Error al actualizar la venta: " + error.message);
    } finally {
        db.release();
    }
};

const eliminarVenta = async (id) => {
    try {
        await db.query('BEGIN');

        const queryRenta = {
            text: `
                DELETE FROM "tblRentas"
                WHERE "idRenta" = $1
                RETURNING *
            `,
            values: [id],
        };

        const { rows: ventaEliminada } = await db.query(queryRenta);

2
        const queryDetalle = {
            text: `
                UPDATE "tbDetaileRenta"
                SET "montoPagado" = "montoPagado" - $1
                WHERE "tcDetaileRenta" = $2
            `,
            values: [100, ventaEliminada[0].idDetalleRenta], // Ejemplo: reducir el monto pagado
        };
        await db.query(queryDetalle);

        await db.query('COMMIT'); // Confirmar la transacción
        return ventaEliminada[0];
    } catch (error) {
        await db.query('ROLLBACK'); // Revertir la transacción en caso de error
        throw new Error("Error al eliminar la venta: " + error.message);
    } finally {
        db.release();
    }
};

// export const RentaModel = {
//    
// };