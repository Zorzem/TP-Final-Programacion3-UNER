import { errorResponse } from "./utils/apiResponse.js"; // importa el helper
import express from "express";
import { router as v1ServiciosRutas } from "./v1/routes/serviciosRoutes.js";

process.loadEnvFile();

const app = express();

app.use(express.json());

// rutas
app.use("/api/v1/servicios", v1ServiciosRutas);

// para manejar rutas inválidas
app.use((req, res, next) => {
  return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, 404);
});

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
