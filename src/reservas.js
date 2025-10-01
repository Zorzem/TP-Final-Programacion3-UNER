import express from "express";
import { router as v1ServiciosRutas } from "./v1/routes/serviciosRoutes.js";

// Inicializa Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/v1/servicios", v1ServiciosRutas);

// Cargar variables de entorno
process.loadEnvFile();

// Escucha en el puerto definido
app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
