import { conexion } from "./conexion.js";

export default class Servicios {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = "SELECT * FROM servicios";
    if (!incluirInactivos) {
      sql += " WHERE activo = 1";
    }

    const [servicios] = await conexion.execute(sql);
    return servicios;
  };

  crear = async (descripcion, importe) => {
    const sql = "INSERT INTO servicios (descripcion, importe) VALUES (?,?)";
    const [resultado] = await conexion.execute(sql, [descripcion, importe]);
    return resultado.insertId;
  };

  buscarPorId = async (id) => {
    const sql = "SELECT * FROM servicios WHERE servicio_id = ?";
    const [servicio] = await conexion.execute(sql, [id]);
    return servicio[0] || null;
  };

  editar = async (id, { descripcion, importe, activo }) => {
    const [servicioExistente] = await conexion.execute("SELECT * FROM servicios WHERE servicio_id = ?", [id]);

    if (servicioExistente.length === 0) {
      return false; // servicio no existe
    }

    // construcción dinámica del SQL
    const campos = [];
    const valores = [];

    if (descripcion !== undefined) {
      campos.push("descripcion = ?");
      valores.push(descripcion);
    }
    if (importe !== undefined) {
      campos.push("importe = ?");
      valores.push(importe);
    }
    if (activo !== undefined) {
      campos.push("activo = ?");
      valores.push(activo);
    }

    if (campos.length === 0) {
      return true; // nada que actualizar
    }

    const sql = `UPDATE servicios SET ${campos.join(", ")} WHERE servicio_id = ?`;
    valores.push(id);

    const [result] = await conexion.execute(sql, valores);
    return result.affectedRows > 0;
  };

  eliminar = async (id) => {
    const sql = "UPDATE servicios SET activo = 0 WHERE servicio_id = ?";
    const [resultado] = await conexion.execute(sql, [id]);
    return resultado;
  };
}
