// src/services/dashboardService.js

import {
  contarUsuarios,
  contarReservas,
  contarEncuestas,
  contarTurnos,
  contarServicios,
  contarSalones,
} from "../db/dashboard.js";

export const obtenerEstadisticas = async () => {
  try {
    // ejecuta todas las tareas en paralelo
    const [usuarios, reservas, encuestas, turnos, servicios, salones] = await Promise.all([
      contarUsuarios(),
      contarReservas(),
      contarEncuestas(),
      contarTurnos(),
      contarServicios(),
      contarSalones(),
    ]);

    return { usuarios, reservas, encuestas, turnos, servicios, salones };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
