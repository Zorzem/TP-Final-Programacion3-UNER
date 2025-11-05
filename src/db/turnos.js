// src/db/turnos.js

import { conexion } from "./conexion.js";

export default class Turnos {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = "SELECT * FROM turnos";
    if (!incluirInactivos) {
      sql += " WHERE activo = 1";
    }
    const [turnos] = await conexion.execute(sql);
    return turnos;
  };

  buscarPorId = async (id) => {
    const sql = "SELECT * FROM turnos WHERE turno_id = ?";
    const [turno] = await conexion.execute(sql, [id]);
    return turno[0] || null;
  };

  crear = async ({ orden, hora_desde, hora_hasta }) => {
    const sql = `
      INSERT INTO turnos (orden, hora_desde, hora_hasta)
      VALUES (?, ?, ?)
    `;
    const [resultado] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
    return resultado.insertId;
  };

  editar = async (id, datos) => {
    const [existe] = await conexion.execute("SELECT * FROM turnos WHERE turno_id = ?", [id]);
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

    const sql = `UPDATE turnos SET ${campos.join(", ")} WHERE turno_id = ?`;
    valores.push(id);
    const [result] = await conexion.execute(sql, valores);
    return result.affectedRows > 0;
  };

  eliminar = async (id) => {
    const sql = "UPDATE turnos SET activo = 0 WHERE turno_id = ?";
    const [resultado] = await conexion.execute(sql, [id]);
    return resultado;
  };
}
