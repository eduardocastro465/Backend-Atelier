//Conexion a postgres
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "Eduardo1234";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_NAME = process.env.DB_NAME || "atelierdb";
export const DB_PORT = process.env.DB_PORT || 5432;


//Configuración del servidor
export const PORT = process.env.PORT || 4000;
export const API_VERSION = process.env.API_VERSION || "1";

export const CORS_ORIGINS = process.env.CORS_ORIGINS || ["https://proyecto-atr.vercel.app", "http://localhost:4200",
    "http://192.168.0.108:4200", "http://localhost:5278", "https://proyectoatr.com",];


//firma del token (JWT)
export const JWT_SECRET = process.env.JWT_SECRET || "Atelier2000";


// Configuración de Google reCAPTCHA
export const GOOGLE_RECAPTCHA_KEY_SITIO =
    process.env.GOOGLE_RECAPTCHA_KEY_SITIO || "6Ld8joAqAAAAABuc_VUhgDt7bzSOYAr7whD6WeNI";

export const GOOGLE_RECAPTCHA_SECRET_KEY =
    process.env.GOOGLE_RECAPTCHA_SECRET_KEY || "6Ld8joAqAAAAAOCmn8PMdVH5CNv-ODrSqNIsp-0m";


// Configuración de Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dvvhnrvav";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "982632489651298";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "TTIZcgIMiC8F4t8cE-t6XkQnPyQ";


//Carpetas de donde se guardan las imagenes en cloudinay
export const CLOUDINARY_FOLDER_PRODUCTOS =
    process.env.CLOUDINARY_FOLDER_PRODUCTOS || "ProductosAtelier";

export const CLOUDINARY_FOLDER_ACCESORIOS =
    process.env.CLOUDINARY_FOLDER_ACCESORIOS || "AccesoriosAtelier";

