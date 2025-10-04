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
  editar = async (id, { descripcion, importe, activo }) => {
    const [servicioExistente] = await conexion.execute(
      "SELECT * FROM servicios WHERE servicio_id = ?",
      [id]
    );

    if (servicioExistente.length === 0) {
      return false; // No existe el servicio
    };
    // Actualizar los campos
    const sql = `UPDATE servicios SET descripcion = ?, importe = ?, activo = ? WHERE servicio_id = ?`;
    const [result] = await conexion.execute(sql, [descripcion, importe, activo, id]);

    if (result && typeof result.affectedRows !== 'undefined') {
      return result.affectedRows > 0;
    }
    return true;
  };
}; 
