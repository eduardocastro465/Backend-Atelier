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
    
// Claves VAPID
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BLYrs4NfSkkjBeVIMgH2ANO4Hcd3FrGKYXabe5L6jpURiePXV9cbl4IewwLjzdszahWAb8SaiPNmyMz6mywr6KY";
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "keH3GwgD0noSJ7IHg_DLwMRP5WM8T0xlRRb2OG-bjFI";
export const VAPID_CONTACT_EMAIL = process.env.VAPID_CONTACT_EMAIL || "20221136@uthh.edu.mx";

// Configuración de correo
export const SMTP_USER = process.env.SMTP_USER || "driftspotky@gmail.com";
export const SMTP_PASS = process.env.SMTP_PASS || "bdpwlrccwlzwcxeu";

// Configuración de WhatsApp
export const SMS_API_KEY = process.env.SMS_API_KEY || "35b2ca1a0d6af4a4b475372fd4ea9cdde5d6d583";
export const SMS_INSTANCE_ID = process.env.SMS_INSTANCE_ID || "r3pptb71-t3ww-wv65-w9of-vbcp9so85b23";
export const SMS_TARGET_NUMBER = process.env.SMS_TARGET_NUMBER || "7711403469";
export const SMS_COUNTRY_CODE = process.env.SMS_COUNTRY_CODE || "52";

// Configuración de reCAPTCHA (desconocida)
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "6LdBsWMqAAAAAAkHOGSNK6S81AGtqac1Y_w8Pnm1";

// Otra clave VAPID (desconocida)
export const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY || "BLv1OsXWTKWajITSezUlM1ebsbRWmoTiRK1_3Pr_ckxyEMFXu9lu9jzDt-2AK37wridHHNL9V0H4BtljjN0ZzxQ";