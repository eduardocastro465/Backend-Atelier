import nodemailer from "nodemailer";
import { SMTP_USER, SMTP_PASS } from "../config.js";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //el numero de la suerte xD
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});