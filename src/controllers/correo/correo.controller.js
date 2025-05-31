
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { logger } from "../../libs/logger.js";
import {sanitizeObject} from "../../libs/sanitize.js";
import { JWT_SECRET } from "../../config.js";
import { transporter } from "../../libs/transporter.js";

const enviarCorreoyCuerpo = async (req, res) => {
    try {
        const { email } = sanitizeObject(req.body);

        const codigo = Math.floor(1000 + Math.random() * 9000); // Código de 4 dígitos

        if (!email) {
            logger.warn("Intento de envío de correo sin email.");
            return res.status(400).json({ message: "El email es requerido" });
        }

        // Hashear el código
        const hashedCode = await bcrypt.hash(codigo.toString(), 10);

        // Generar token con el hash del código
        const token = jwt.sign({ hashedCode }, JWT_SECRET, {
            expiresIn: "15m",
        });

        // Enviar correo con el código real
        await enviarCodigoVerficiacionActivaCuenta(email, codigo);

        // Devolver el token al cliente
        res.status(200).json({ message: "Correo enviado", token });
    } catch (error) {
        // logger.error("Error en enviarCorreoyCuerpo:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

async function enviarCodigoVerficiacionActivaCuenta(email, code) {
    const expiracion = new Date(new Date().getTime() + 15 * 60000);
    const tiempoRestante = Math.floor((expiracion - new Date()) / 60000); // Calcular minutos restantes

    const mailOptions = {
        from: '"Atelier" <atelier>',
        to: email,
        subject: "Activación de cuenta",
        html: `
    <div style="text-align: center;">
      <img 
        src="https://scontent.fver2-1.fna.fbcdn.net/v/t39.30808-6/428626270_122131445744124868_2285920480645454536_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGyFH5OuM6r1tACq3-mVFcYR0h90jzEayNHSH3SPMRrI51RogsRfGPAbUgPfKvg07sOtYgtuNKj9Z6QFXwTItIa&_nc_ohc=8hl8yeqpTEEQ7kNvgGedGRK&_nc_zt=23&_nc_ht=scontent.fver2-1.fna&_nc_gid=ABKLJP1JM9SqQAYgwjeYfjR&oh=00_AYBnl4LdKUUFbd65zViJYdqZvy3chdMfV2r0MnTt3CZjxw&oe=671C7743" 
        alt="Logo" 
        style="border-radius: 50%; width: 100px; height: 100px;" 
      />
    </div>
    <p>Hola,</p>
    <p>Recibimos una solicitud para activar tu cuenta. Ingresa el siguiente código para activarla:</p>
    <p style="font-size: 20px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">${code}</p>
    <p>Este código es válido por <strong>${tiempoRestante} minutos</strong>. Por favor, utilízalo antes de que expire.</p>
    <p>Si no solicitaste esta verificación, ignora este mensaje.</p>
    <p style="font-size: 12px; color: #666;">Atentamente,<br>El equipo de Atelier</p>
  `,
    };

    return transporter.sendMail(mailOptions);
}

export const CorreoController = {
    enviarCorreoyCuerpo,
};