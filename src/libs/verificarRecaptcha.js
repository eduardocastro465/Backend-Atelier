import axios from "axios";
import { logger } from "../libs/logger.js";
import { GOOGLE_RECAPTCHA_SECRET_KEY } from "../config.js";

export const verifyTurnstile = async (captchaToken) => {
    try {
        const url = `https://www.google.com/recaptcha/api/siteverify`;

        const response = await axios.post(url, null, {
            params: {
                secret: GOOGLE_RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            },
        });
        return response.data.success;
    } catch (error) {
        console.log(error)
        logger.error("Error al verificar el CAPTCHA:", error.message);
        return false;
    }
};