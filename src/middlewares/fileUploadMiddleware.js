import fileUpload from "express-fileupload";

const fileUploadMiddleware = fileUpload({
  useTempFiles: true, // Usar archivos temporales
  tempFileDir: "./uploads", // Carpeta temporal para almacenar archivos
});

export default fileUploadMiddleware;