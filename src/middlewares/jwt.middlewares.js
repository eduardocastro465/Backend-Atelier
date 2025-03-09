import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const verificaToken = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "Token no aprobado" });
    }

    //separa el token del otro mensaje
    token = token.split(" ")[1];
    try {
        const { correo } = jwt.verify(token, JWT_SECRET)
        req.correo = correo;
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "token invalido" });
    }
};
