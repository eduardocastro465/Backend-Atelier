import dotenv from 'dotenv';
dotenv.config();

//Conexion a postgres
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const DB_SSL = process.env.DB_SSL;


//Configuración del servidor
export const PORT = process.env.PORT;
export const API_VERSION = process.env.API_VERSION;

export const CORS_ORIGINS = process.env.CORS_ORIGINS;


//firma del token (JWT)
export const JWT_SECRET = process.env.JWT_SECRET;


// Configuración de Google reCAPTCHA
export const GOOGLE_RECAPTCHA_KEY_SITIO =
    process.env.GOOGLE_RECAPTCHA_KEY_SITIO;

export const GOOGLE_RECAPTCHA_SECRET_KEY =
    process.env.GOOGLE_RECAPTCHA_SECRET_KEY;


// Configuración de Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;


//Carpetas de donde se guardan las imagenes en cloudinay
export const CLOUDINARY_FOLDER_PRODUCTOS =
    process.env.CLOUDINARY_FOLDER_PRODUCTOS;

export const CLOUDINARY_FOLDER_ACCESORIOS =
    process.env.CLOUDINARY_FOLDER_ACCESORIOS;

// Claves VAPID
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
export const VAPID_CONTACT_EMAIL = process.env.VAPID_CONTACT_EMAIL;

// Configuración de correo
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

// Configuración de WhatsApp
export const SMS_API_KEY = process.env.SMS_API_KEY;
export const SMS_INSTANCE_ID = process.env.SMS_INSTANCE_ID;
export const SMS_TARGET_NUMBER = process.env.SMS_TARGET_NUMBER;
export const SMS_COUNTRY_CODE = process.env.SMS_COUNTRY_CODE;

// Configuración de reCAPTCHA (desconocida)
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Otra clave VAPID (desconocida)
export const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;