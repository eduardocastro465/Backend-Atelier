import bcryptjs from 'bcryptjs'
import { createAccessToken } from "../../libs/jwt.js";
import { limpiaNumero } from "../../utils/formateo.js";
import { verifyTurnstile } from "../../utils/recaptcha.api.js";
import { sanitizeObject } from "../../libs/sanitize.js";
import { logger } from "../../libs/logger.js";
import { UserModel } from '../../models/usuario/user.model.js';
import { AuthModel } from '../../models/usuario/auth.model.js';

const SalRounds = 10;

const crearUsuario = async (req, res) => {
    try {
        const { nombre, telefono, email, password } = sanitizeObject(req.body);

        if (!nombre || !telefono || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "elementos requeridos: usuario, correo y contraseña ",
            })
        }

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

        const newUser = await AuthModel.crearUsuario({ nombre, email, contrasena: hashedPassword, telefono: telefonoFormateado })

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
       
        const isMatch = await bcryptjs.compare(password, user.contrasena)

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

export const AuthController = {
    crearUsuario,
    Login,
};