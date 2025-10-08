import express from "express";
import { router as v1ServiciosRutas } from "./v1/routes/serviciosRoutes.js";

process.loadEnvFile();

const app = express();

app.use(express.json());

// Rutas
app.use("/api/v1/servicios", v1ServiciosRutas);

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
