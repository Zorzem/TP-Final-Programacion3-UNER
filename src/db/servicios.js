import { conexion } from "./conexion.js";

export default class Servicios {
  buscarTodos = async () => {
    const sql = "SELECT * FROM servicios where activo = 1";
    const [servicios] = await conexion.execute(sql);
    return servicios;
  };

  crear = async (descripcion, importe) => {
      const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?,?)';
      const [resultado] =await conexion.execute(sql, [descripcion, importe]);
      return resultado.insertId;
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
 
    const sql = `UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?`;
    const [result] = await conexion.execute(sql, [descripcion, importe, id]);

    if (result && typeof result.affectedRows !== 'undefined') {
      return result.affectedRows > 0;
    }
    return true;
  };
  

  eliminar = async(id) => {
      const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?'; 
      const [resultado] = await conexion.execute(sql, [id]);
      return resultado;
  }
}