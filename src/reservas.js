import { errorResponse } from "./utils/apiResponse.js";
import express from "express";
import turnosRoutes from "./v1/routes/turnosRoutes.js";
import salonesRoutes from "./v1/routes/salonesRoutes.js";
import reservasRoutes from "./v1/routes/reservasRoutes.js";
import serviciosRoutes from "./v1/routes/serviciosRoutes.js";
import usuariosRoutes from "./v1/routes/usuariosRoutes.js";
import encuestasRoutes from "./v1/routes/encuestasRoutes.js";

process.loadEnvFile();

const app = express();

app.use(express.json());

// rutas
app.use("/api/v1/servicios", serviciosRoutes);
app.use("/api/v1/salones", salonesRoutes);
app.use("/api/v1/turnos", turnosRoutes);
app.use("/api/v1/reservas", reservasRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/encuestas", encuestasRoutes);


// para manejar rutas inválidas
app.use((req, res, next) => {
  return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, 404);
});

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
