import { conexion } from "../db/conexion.js";

export const obtenerEstadisticas = async () => {
  try {
    const [usuarios] = await conexion.query("SELECT COUNT(*) AS total FROM usuarios");
    const [reservas] = await conexion.query("SELECT COUNT(*) AS total FROM reservas");
    const [encuestas] = await conexion.query("SELECT COUNT(*) AS total FROM encuestas");

    return {
      usuarios: usuarios[0].total,
      reservas: reservas[0].total,
      encuestas: encuestas[0].total,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
