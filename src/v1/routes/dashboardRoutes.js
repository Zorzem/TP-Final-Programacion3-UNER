// src/v1/routes/dashboardRoutes.js

import express from "express";
import { obtenerEstadisticas } from "../../services/dashboardService.js";

const router = express.Router();

// ruta pública del dashboard (sin autenticación)
router.get("/", async (req, res) => {
  try {
    const stats = await obtenerEstadisticas();
    res.json({ estado: "Exito", datos: stats });
  } catch (error) {
    res.status(500).json({ estado: "Falla", mesaje: "Error al obtener estadísticas." });
  }
});

export default router;
