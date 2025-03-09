import pg from "pg";
import { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } from "../config.js";
import { formatearFecha } from "../utils/formateo.js";
import { textoColorido } from "../utils/colorText.js";

export const db = new pg.Pool({
  allowExitOnIdle: true,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT,
});



const connectDB = async () => {
  const modoProduction = process.env.NODE_ENV === "production";

  try {
    //conexion a la base de datos
    const fecha = await db.query(`SELECT NOW()`);

    // obtenemos la fecha y hora
    const fechaFormateada = formatearFecha(new Date(fecha.rows[0].now));


    textoColorido(
      [
        `      🚀 Base de datos conectada  💻`,
        ` Hora de conexión: ${fechaFormateada} `,
      ],
      ["rgb(60, 255, 0)", "rgb(9, 188, 9)"], modoProduction
    );

  } catch (error) {
    textoColorido(
      ["🔥 ERROR: No se pudo conectar a la base de datos", "Detalles: Conexión rechazada 🛸"],
      ["rgb(255, 0, 0)", "rgb(255, 69, 0)"],
      modoProduction)

  }
}

connectDB();