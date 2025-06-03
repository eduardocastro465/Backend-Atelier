import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { textoColorido } from "./src/utils/colorText.js";
import { CORS_ORIGINS, API_VERSION, PORT } from "./src/config.js";
import { httpLogger, applySecurityHeaders } from "./src/middlewares/middlewares.config.js";
import userRouter from "./src/routes/usuario/user.routes.js";
import authRouter from "./src/routes/usuario/auth.routes.js";
import correoRouter from "./src/routes/correo/correo.route.js";
import empresaRouter from "./src/routes/empresa/empresa.routes.js";
import reseniaRouter from "./src/routes/empresa/resenia.routes.js";
import vestidosRouter from "./src/routes/productos/vestidos.routes.js";
import categoriaRouter from "./src/routes/productos/categoria.routes.js";
import ventaRouter from "./src/routes/renta-venta-estadisticas/venta.routes.js";
import rentaRouter from "./src/routes/renta-venta-estadisticas/renta.routes.js";
import paypalRouter from "./src/routes/paypal/paypal.routes.js";


const modoProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: CORS_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(httpLogger);

applySecurityHeaders(app);


// Solo habilitamos los mensajes por consola en el modo de desarrollo
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

if (!PORT || !API_VERSION) {
  console.error("❌ Faltan variables de entorno necesarias (PORT, API_VERSION)");
  process.exit(1);
}

const API = `/api/${API_VERSION}`;

app.use(`${API}/usuarios`, userRouter);
app.use(`${API}/autentificacion`, authRouter);
app.use(`${API}/notificaciones`, correoRouter);
app.use(`${API}/empresa`, empresaRouter);
app.use(`${API}/resenia`, reseniaRouter);
app.use(`${API}/productos`, vestidosRouter);
app.use(`${API}/categorias`, categoriaRouter);
app.use(`${API}/rentas`, rentaRouter);
app.use(`${API}/ventas`, ventaRouter);
app.use(`${API}/paypal`, paypalRouter);

//simulacion de proceso de pago desde el frontend
app.use(express.static(path.join(__dirname, "src/public")));

app.listen(PORT, () => {
  textoColorido([`🌎 Servidor corriendo en el puerto: ${PORT} 🖥`],
    ["rgb(33, 97, 235)", "rgb(46, 15, 183)"], modoProduction);
});