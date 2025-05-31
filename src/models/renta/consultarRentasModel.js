import { db } from "../../database/db.js";

// Obtener todas las rentas
const getRentas = async () => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas"`,
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas:", error);
        throw new Error("Error al obtener las rentas");
    }
};

// Obtener una renta por ID
const getRentaPorId = async (idRenta) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "idRenta" = $1`,
            values: [idRenta],
        };

        const { rows: renta } = await db.query(query);
        return renta[0]; // Retorna la primera fila (única, ya que es por ID)
    } catch (error) {
        console.error("Error al obtener la renta por ID:", error);
        throw new Error("Error al obtener la renta por ID");
    }
};

// Obtener rentas por ID de usuario
const getRentasPorIdUsuario = async (idUsuario) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "idUsuario" = $1`,
            values: [idUsuario],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por usuario:", error);
        throw new Error("Error al obtener las rentas por usuario");
    }
};


// Obtener rentas por ID de vestido
const getRentasPorIdVestido = async (idVestido) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "idVestido" = $1`,
            values: [idVestido],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por vestido:", error);
        throw new Error("Error al obtener las rentas por vestido");
    }
};

// Obtener rentas por estado
const getRentasPorEstado = async (estado) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "estado" = $1`,
            values: [estado],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por estado:", error);
        throw new Error("Error al obtener las rentas por estado");
    }
};

// Obtener detalles de renta por ID
const getDetalleRentaPorId = async (idDetalleRenta) => {
    try {
        const query = {
            text: `SELECT * FROM "tblDetalleRenta" WHERE "idDetalleRenta" = $1`,
            values: [idDetalleRenta],
        };

        const { rows: detalleRenta } = await db.query(query);
        return detalleRenta[0]; // Retorna la primera fila (única, ya que es por ID)
    } catch (error) {
        console.error("Error al obtener el detalle de renta por ID:", error);
        throw new Error("Error al obtener el detalle de renta por ID");
    }
};

// Obtener rentas por ID de detalle de renta
const getRentasPorIdDetalleRenta = async (idDetalleRenta) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "idDetalleRenta" = $1`,
            values: [idDetalleRenta],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por detalle de renta:", error);
        throw new Error("Error al obtener las rentas por detalle de renta");
    }
};

// Obtener rentas por fecha de registro
const getRentasPorFechaRegistro = async (fechaRegistro) => {
    try {
        const query = {
            text: `SELECT * FROM "tblRentas" WHERE "fechaDeRegistro" = $1`,
            values: [fechaRegistro],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por fecha de registro:", error);
        throw new Error("Error al obtener las rentas por fecha de registro");
    }
};

// Obtener rentas por método de pago
const getRentasPorMetodoDePago = async (metodoDePago) => {
    try {
        const query = {
            text: `SELECT * FROM "tblDetalleRenta" WHERE "metodoDePago" = $1`,
            values: [metodoDePago],
        };

        const { rows: rentas } = await db.query(query);
        return rentas;
    } catch (error) {
        console.error("Error al obtener las rentas por método de pago:", error);
        throw new Error("Error al obtener las rentas por método de pago");
    }
};

// Obtener rentas con detalles de renta (JOIN entre tblRentas y tbDetaileRenta)
const getRentasConDetalles = async () => {
    try {
        const query = {
            text: `
                SELECT r.*, d.*
                FROM "tblRentas" r
                INNER JOIN "tblDetalleRenta" d ON r."idDetalleRenta" = d."tblDetalleRenta"
            `,
        };

        const { rows: rentasConDetalles } = await db.query(query);
        return rentasConDetalles;
    } catch (error) {
        console.error("Error al obtener las rentas con detalles:", error);
        throw new Error("Error al obtener las rentas con detalles");
    }
};

export const RentaModel = {
    getRentas, getRentaPorId, getRentasPorEstado,
    getRentasPorIdUsuario, getRentasPorIdVestido,
    getDetalleRentaPorId, getRentasPorIdDetalleRenta,
    getRentasPorFechaRegistro, getRentasPorMetodoDePago,
    getRentasConDetalles
};