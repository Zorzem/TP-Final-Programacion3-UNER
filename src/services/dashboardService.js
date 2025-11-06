// src/services/dashboardService.js
import { conexion } from "../db/conexion.js";

export const obtenerEstadisticas = async () => {
  try {
    const [usuarios] = await conexion.query("SELECT COUNT(*) AS total FROM usuarios");
    const [reservas] = await conexion.query("SELECT COUNT(*) AS total FROM reservas");
    const [encuestas] = await conexion.query("SELECT COUNT(*) AS total FROM encuestas");
    const [turnos] = await conexion.query("SELECT COUNT(*) AS total FROM turnos");
    const [servicios] = await conexion.query("SELECT COUNT(*) AS total FROM servicios");
    const [salones] = await conexion.query("SELECT COUNT(*) AS total FROM salones");

    return {
      usuarios: usuarios[0].total,
      reservas: reservas[0].total,
      encuestas: encuestas[0].total,
      turnos: turnos[0].total,
      servicios: servicios[0].total,
      salones: salones[0].total,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
