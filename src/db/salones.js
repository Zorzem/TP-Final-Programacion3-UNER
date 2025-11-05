// src/db/salones.js

import { conexion } from "./conexion.js";

export default class Salones {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = "SELECT * FROM salones";
    if (!incluirInactivos) {
      sql += " WHERE activo = 1";
    }
    const [salones] = await conexion.execute(sql);
    return salones;
  };

  crear = async ({ titulo, direccion, latitud, longitud, capacidad, importe }) => {
    const sql = `
      INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await conexion.execute(sql, [titulo, direccion, latitud, longitud, capacidad, importe]);
    return resultado.insertId;
  };

  buscarPorId = async (id) => {
    const sql = "SELECT * FROM salones WHERE salon_id = ?";
    const [salon] = await conexion.execute(sql, [id]);
    return salon[0] || null;
  };

  editar = async (id, datos) => {
    const [existe] = await conexion.execute("SELECT * FROM salones WHERE salon_id = ?", [id]);
    if (existe.length === 0) return false;

    const campos = [];
    const valores = [];

    for (const [campo, valor] of Object.entries(datos)) {
      if (valor !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(valor);
      }
    }

    if (campos.length === 0) return true;

    const sql = `UPDATE salones SET ${campos.join(", ")} WHERE salon_id = ?`;
    valores.push(id);
    const [result] = await conexion.execute(sql, valores);
    return result.affectedRows > 0;
  };

  eliminar = async (id) => {
    const sql = "UPDATE salones SET activo = 0 WHERE salon_id = ?";
    const [resultado] = await conexion.execute(sql, [id]);
    return resultado;
  };
}
