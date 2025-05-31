import bcryptjs from 'bcryptjs'
import { createAccessToken } from "../../libs/jwt.js";
import { limpiaNumero } from "../../utils/formateo.js";
import { verifyTurnstile } from "../../libs/verificarRecaptcha.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from "../../libs/logger.js";
import { UserModel } from '../../models/usuario/user.model.js';
import { AuthModel } from '../../models/usuario/auth.model.js';


const SalRounds = 10;

const registrarUsuario = async (req, res) => {
    try {

        const { nombre, email, telefono, password } = sanitizeObject(req.body);

        const user = await UserModel.buscaUnCorreo(email);

        if (user) {
            return res.status(409).json({ ok: false, msg: "Correo ya registrado" });
        }

        const telefonoFormateado = limpiaNumero(telefono)

        const telefonoDuplicado = await UserModel.buscarUnTelefono(telefonoFormateado)

        if (telefonoDuplicado) {
            return res
                .status(400)
                .send({ message: "El número telefónico ya esta resgistrado" });
        }

        const salt = await bcryptjs.genSalt(SalRounds);

        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await AuthModel.crearUsuario({
            fotoDePerfil: "https://res.cloudinary.com/dxmhlxdxo/image/upload/v1743916178/Imagenes%20para%20usar%20xD/gxvcu5gik59c0uu7zz4p.png",
            nombre: nombre || "",
            rol: "CLIENTE",
            email: email || "",
            contrasena: hashedPassword,
            telefono: telefonoFormateado
        })

        const token = await createAccessToken({ id: newUser.idUsuario, correo: newUser.correo, rol: newUser.rol })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 3600000,//equivale a 1h
        });

        return res.status(201).json({ ok: true, msg: "Usuario resgitrado con exito" });
    } catch (error) {
        logger.warn("Algo fallo, ", { error });
        console.log({ error: error.message });
        return res.status(500).json({
            ok: false,
            mgs: "Error del servidor",
        });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password,
            captchaToken
        } = sanitizeObject(req.body);

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "elementos requeridos: usuario, correo y contraseña ",
            })
        }
        const isCaptchaValid = verifyTurnstile(captchaToken)

        if (!isCaptchaValid) {
            return res.status(400).json({ message: "Captcha inválido" });
        }

        const user = await UserModel.buscaUnCorreo(email);

        if (!user) {
            return res.status(409).json({ ok: false, msg: "Correo no registrado" });
        }

        const isMatch = await bcryptjs.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                ok: false,
                msg: "credenciales incorretas",
            })
        }
        if (!user.rol) {

            return res
                .status(401)
                .json({ message: "El usuario no tiene un rol asignado" });
        }

        const token = await createAccessToken({ id: user.idUsuario, correo: user.correo, rol: user.rol, })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000,
        });

        return res
            .status(200)
            .json({
                token,
            });
    } catch (error) {
        logger.warn("Algo fallo, ", { error });
        console.log({ error: error.message });
        return res.status(500).json({
            ok: false,
            mgs: "Error del servidor",
        });
    }
};

const verificarCorreo = async (req, res) => {
    try {
        const { email } = sanitizeObject(req.body);

        if (!email) {
            return res.status(400).json({
                ok: false,
                msg: "Correo requerido",
            })
        }

        const user = await UserModel.buscaUnCorreo(email);

        if (user) {
            return res.status(409).json({ ok: false, msg: "El email ya está registrado" });
        }

        return res.status(200).json({ message: "El email está disponible" });
    } catch (error) {
        logger.warn("Algo fallo, ", { error });
        console.log({ error: error.message });
        return res.status(500).json({
            ok: false,
            mgs: "Error del servidor",
        });
    }
};
const verificarTelefono = async (req, res) => {
    try {
        const { telefono } = sanitizeObject(req.body);

        if (!telefono) {
            return res.status(400).json({
                ok: false,
                msg: "Telefono requerido",
            })
        }
        const telefonoFormateado = limpiaNumero(telefono)

        const user = await UserModel.buscarUnTelefono(telefonoFormateado);

        if (user) {
            return res.status(409).json({ ok: false, msg: "El numero de telefono ya está registrado" });
        }

        return res.status(200).json({ message: "El telefono está disponible" });
    } catch (error) {
        logger.warn("Algo fallo, ", { error });
        console.log({ error: error.message });
        return res.status(500).json({
            ok: false,
            mgs: "Error del servidor",
        });
    }
};


const signInGoogleFacebook = async (req, res) => {
    try {

        const { displayName, email, photoURL, uid } = sanitizeObject(req.body);

        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }

        // Buscar usuario existente
        const usuario = await UserModel.buscaUnCorreo(email);



        if (usuario) {

            const usuarioCuenta = await UserModel.getUsuarioConCuenta(usuario.idUsuario);

            if (usuarioCuenta.estado === "bloqueada") {
                const ahora = Date.now();
                const tiempoRestante =
                    usuarioCuenta.fechaDeUltimoBloqueo.getTime() +
                    usuarioCuenta.tiempoDeBloqueo * 1000 -
                    ahora;

                if (tiempoRestante > 0) {
                    return res.status(403).json({
                        message: `Cuenta bloqueada. Intenta nuevamente en ${Math.ceil(
                            tiempoRestante / 1000
                        )} segundos.`,
                        tiempo: usuarioCuenta.tiempoDeBloqueo,
                        numeroDeIntentos: usuarioCuenta.intentosFallidos,
                    });
                }

                // Restablecer cuenta bloqueada
                usuarioCuenta.estado = "activa";
                usuarioCuenta.intentosFallidos = 0;
                usuarioCuenta.fechaDeUltimoBloqueo = null;
            }

        } else {

            // Crear nuevo usuario para Google/Facebook
            const usuarioCreado = await AuthModel.crearUsuarioWithGoogleFacebook({
                displayName,
                email,
                photoURL,
                rol: "CLIENTE",
            });
            if (!usuarioCreado) {
                return res.status(500).json({ message: "Error al crear el usuario" });
            }
        }

        const newUsuario = await UserModel.buscaUnCorreo(email);
        console.log(newUsuario)

        const token = await createAccessToken({
            id: newUsuario.idUsuario, correo: newUsuario.correo
            , rol: newUsuario.rol
        })

        // Configurar cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 86400000, // 24 horas en ms
        });

        return res.status(200)
            .json({
                token,
                rol: newUsuario.rol,
                usuario: {
                    nombre: newUsuario.nombre,
                    email: newUsuario.email,
                    fotoDePerfil: newUsuario.fotoDePerfil
                }
            });

    } catch (error) {
        logger.warn("Algo fallo, ", { error });
        console.log(error);
        return res.status(500).json({
            ok: false,
            mgs: "Error del servidor",
        });
    }
};



export const AuthController = {
    registrarUsuario,
    Login,
    verificarCorreo,
    verificarTelefono,
    signInGoogleFacebook
};