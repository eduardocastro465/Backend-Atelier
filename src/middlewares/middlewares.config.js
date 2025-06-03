import helmet from "helmet";
import { logHttpRequest } from "../libs/logger.js";

// Middleware para logging de peticiones HTTP
export function httpLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logHttpRequest(req, res, duration);
    });
    next();
}

// Middleware para configuraciones de Helmet

export function applySecurityHeaders(app) {
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "trusted-scripts.com",
                    "'unsafe-eval'",  // Necesario para PayPal sandbox
                    // Dominios de PayPal
                    "https://*.paypal.com",
                    "https://*.paypal.cn",
                    "https://*.paypalobjects.com",
                    "https://objects.paypal.cn",
                    "https://www.gstatic.com",
                    "https://*.synchronycredit.com",
                    "https://synchronycredit.com",
                    "https://www.datadoghq-browser-agent.com",
                    "https://static.novacredit.com",
                ],
                styleSrc: ["'self'", "trusted-styles.com", "'unsafe-inline'"],
                imgSrc: ["'self'", "trusted-images.com"],
                connectSrc: ["'self'", "api.trusted.com", "blob:"],
                workerSrc: ["'self'", "blob:"],
                frameSrc: ["https://*.paypal.com", "https://*.paypalobjects.com"],

            },
            // Deshabilitar nonce automático para evitar conflicto con 'unsafe-eval'
            useDefaults: false,


        })
    );
}
