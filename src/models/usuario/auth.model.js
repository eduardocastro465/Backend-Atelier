import { db } from "../../database/db.js";

const crearUsuario = async ({ fotoDePerfil, nombre, rol, email, contrasena, telefono, }) => {
  try {

    await db.query('BEGIN');

    // 1. Crea una cuenta 
    const queryCuenta = {
      text: `
        INSERT INTO "tblEstadoCuentas" ("intentosFallidos", "fechaUltimoIntentoFallido", "vecesDeBloqueos", "fechaDeUltimoBloqueo")
        VALUES ($1, $2, $3, $4)
        RETURNING "idEstadoCuenta"
      `,
      values: [0, null, 0, null], // Valores iniciales para la cuenta
    };

    const { rows: cuenta } = await db.query(queryCuenta);


    if (!cuenta || cuenta.length === 0) {
      throw new Error("No se pudo crear la cuenta");
    }

    const { idEstadoCuenta } = cuenta[0];
    console.log(idEstadoCuenta)


    // 2. Crear el usuario y enlaza a la cuenta
    const queryUsuario = {
      text: `
        INSERT INTO "tblUsuarios" ("fotoDePerfil", "nombre", "email", "password", "telefono","apellidos", "edad", "direccion", "token", "codigoVerificacion","verificado", "rol", "preguntaSecreta", "respuestaSegura","fechaDeRegistro", "isClienteFrecuente", "isNuevo", "idEstadoCuenta")
        VALUES ($1, $2, $3, $4, $5,'', 0, '', NULL, NULL,false, $6, NULL, NULL,CURRENT_TIMESTAMP, false, true, $7)
        RETURNING "idUsuario", "email"`,
      values: [fotoDePerfil, nombre, email, contrasena, telefono, rol, idEstadoCuenta],
    };

    const { rows: usuario } = await db.query(queryUsuario);

    if (!usuario || usuario.length === 0) {
      throw new Error("No se pudo crear el usuario");
    }

    // Confirmar la transacción
    await db.query('COMMIT');

    return usuario[0];
  } catch (error) {
    // Revertir la transacción en caso de error
    await db.query('ROLLBACK');
    console.error("Error al crear usuario y cuenta:", error);
    throw new Error("Error al crear usuario y cuenta en la base de datos");
  }
};

// 3. Crear usuario con cuenta de Google o Facebook
const crearUsuarioWithGoogleFacebook = async ({ displayName, email, photoURL,rol }) => {
  try {

    await db.query('BEGIN');

    // 1. Crea una cuenta
    const queryCuenta = {
      text: `
        INSERT INTO "tblEstadoCuentas" ("intentosFallidos", "fechaUltimoIntentoFallido", "vecesDeBloqueos", "fechaDeUltimoBloqueo")
        VALUES ($1, $2, $3, $4)
        RETURNING "idEstadoCuenta"
      `,
      values: [0, null, 0, null], // Valores iniciales para la cuenta
    };

    const { rows: cuenta } = await db.query(queryCuenta);


    if (!cuenta || cuenta.length === 0) {
      throw new Error("No se pudo crear la cuenta");
    }

    const { idEstadoCuenta } = cuenta[0];
    console.log(idEstadoCuenta)


    // 2. Crear el usuario y enlaza a la cuenta
    const queryUsuario = {
      text: `
        INSERT INTO "tblUsuarios" ("fotoDePerfil", "nombre", "email", "password", "telefono","apellidos", "edad", "direccion", "token", "codigoVerificacion","verificado", "rol", "preguntaSecreta", "respuestaSegura","fechaDeRegistro", "isClienteFrecuente", "isNuevo", "idEstadoCuenta")
        VALUES ($1, $2, $3, '', '','', 0, '', NULL, NULL,false, $4, NULL, NULL,CURRENT_TIMESTAMP, false, true, $5)
        RETURNING "idUsuario", "email"`,
      values: [photoURL, displayName, email, rol, idEstadoCuenta],
    };

    const { rows: usuario } = await db.query(queryUsuario);

    if (!usuario || usuario.length === 0) {
      throw new Error("No se pudo crear el usuario");
    }

    // Confirmar la transacción
    await db.query('COMMIT');

    return usuario[0];
  } catch (error) {
    // Revertir la transacción en caso de error
    await db.query('ROLLBACK');
    console.error("Error al crear usuario y cuenta:", error);
    throw new Error("Error al crear usuario y cuenta en la base de datos");
  }
};

export const AuthModel = {
  crearUsuario,
  crearUsuarioWithGoogleFacebook
};
