import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { textoColorido } from "./src/utils/colorText.js";
import { CORS_ORIGINS, API_VERSION, PORT } from "./src/config.js";
import { logHttpRequest } from "./src/libs/logger.js";
import userRouter from "./src/routes/usuario/user.routes.js";
import authRouter from "./src/routes/usuario/auth.routes.js";
import correoRouter from "./src/routes/correo/correo.route.js";
import empresaRouter from "./src/routes/empresa/empresa.routes.js";
import reseniaRouter from "./src/routes/empresa/resenia.routes.js";
import vestidosRouter from "./src/routes/productos/vestidos.routes.js";
import categoriaRouter from "./src/routes/productos/categoria.routes.js";
import ventaRouter from "./src/routes/renta-venta-estadisticas/venta.routes.js";
import rentaRouter from "./src/routes/renta-venta-estadisticas/renta.routes.js";

const app = express();

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())

// Solo habilitamos los mensajes por consola en el modo de desarrollo
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
const modoProduction = process.env.NODE_ENV === "production";

app.use((req, res, next) => {
  const start = Date.now(); //Se captura el tiempo actual en milisegundos
  res.on("finish", () => {
    req.ip;
    const duration = Date.now() - start; // se calcula la duración de la solicitud restando el tiempo actual
    logHttpRequest(req, res, duration);
  });
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-scripts.com"],
      styleSrc: ["'self'", "trusted-styles.com"],
      imgSrc: ["'self'", "trusted-images.com"],
      connectSrc: ["'self'", "api.trusted.com"],
    },
  })
);
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

//rutas

app.use(`/api/${API_VERSION}/usuarios`, userRouter);
app.use(`/api/${API_VERSION}/autentificacion`, authRouter);
app.use(`/api/${API_VERSION}/notificaciones`, correoRouter);
app.use(`/api/${API_VERSION}/empresa`, empresaRouter);
app.use(`/api/${API_VERSION}/resenia`, reseniaRouter);
app.use(`/api/${API_VERSION}/productos`, vestidosRouter);
app.use(`/api/${API_VERSION}/categorias`, categoriaRouter);
app.use(`/api/${API_VERSION}/rentas`, rentaRouter);
app.use(`/api/${API_VERSION}/ventas`, ventaRouter);

app.listen(PORT, () => {
  textoColorido([`🌎 Servidor corriendo en el puerto: ${PORT} 🖥`],
    ["rgb(33, 97, 235)", "rgb(46, 15, 183)"], modoProduction);
});
