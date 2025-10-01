import { conexion } from "./conexion.js";

export default class Servicios {
  buscarTodos = async () => {
    const sql = "SELECT * FROM servicios where activo = 1";
    const [servicios] = await conexion.execute(sql);
    return servicios;
  };

  buscarPorId = async (id) => {
    const sql = "SELECT * FROM servicios WHERE servicio_id = ? AND activo = 1";
    const [servicio] = await conexion.execute(sql, [id]);
    return servicio[0] || null;
  };
}
