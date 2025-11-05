// src/db/encuestas.js

import { conexion } from "./conexion.js";

export default class Encuestas {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = `
      SELECT 
        e.encuesta_id,
        e.puntaje,
        e.comentario,
        e.creado,
        r.fecha_reserva,
        s.titulo AS salon,
        CONCAT(u.nombre, ' ', u.apellido) AS usuario,
        e.activo
      FROM encuestas e
      JOIN reservas r ON e.reserva_id = r.reserva_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN usuarios u ON r.usuario_id = u.usuario_id
    `;
    if (!incluirInactivos) {
      sql += " WHERE e.activo = 1";
    }
    sql += " ORDER BY e.creado DESC";

    const [encuestas] = await conexion.execute(sql);
    return encuestas;
  };

  buscarPorUsuario = async (usuarioId, incluirInactivos = false) => {
    let sql = `
      SELECT 
        e.encuesta_id,
        e.puntaje,
        e.comentario,
        e.creado,
        r.fecha_reserva,
        s.titulo AS salon,
        e.activo
      FROM encuestas e
      JOIN reservas r ON e.reserva_id = r.reserva_id
      JOIN salones s ON r.salon_id = s.salon_id
      WHERE r.usuario_id = ?
    `;
    if (!incluirInactivos) {
      sql += " AND e.activo = 1";
    }
    sql += " ORDER BY e.creado DESC";

    const [encuestas] = await conexion.execute(sql, [usuarioId]);
    return encuestas;
  };

  buscarPorSalon = async (salonId, incluirInactivos = false) => {
    let sql = `
      SELECT 
        e.encuesta_id,
        e.puntaje,
        e.comentario,
        e.creado,
        r.fecha_reserva,
        CONCAT(u.nombre, ' ', u.apellido) AS usuario,
        e.activo
      FROM encuestas e
      JOIN reservas r ON e.reserva_id = r.reserva_id
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.salon_id = ?
    `;
    if (!incluirInactivos) {
      sql += " AND e.activo = 1";
    }
    sql += " ORDER BY e.creado DESC";

    const [encuestas] = await conexion.execute(sql, [salonId]);
    return encuestas;
  };

  buscarPorId = async (id) => {
    const sql = `
      SELECT 
        e.encuesta_id,
        e.puntaje,
        e.comentario,
        e.creado,
        e.activo,
        r.fecha_reserva,
        s.titulo AS salon,
        CONCAT(u.nombre, ' ', u.apellido) AS usuario
      FROM encuestas e
      JOIN reservas r ON e.reserva_id = r.reserva_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE e.encuesta_id = ?
    `;
    const [rows] = await conexion.execute(sql, [id]);
    return rows[0] || null;
  };

  crear = async ({ reserva_id, puntaje, comentario }) => {
    const sql = `
      INSERT INTO encuestas (reserva_id, puntaje, comentario)
      VALUES (?, ?, ?)
    `;
    const [resultado] = await conexion.execute(sql, [reserva_id, puntaje, comentario]);
    return resultado.insertId;
  };

  editar = async (id, datos) => {
    const [existe] = await conexion.execute("SELECT * FROM encuestas WHERE encuesta_id = ?", [id]);
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

    const sql = `UPDATE encuestas SET ${campos.join(", ")} WHERE encuesta_id = ?`;
    valores.push(id);
    const [resultado] = await conexion.execute(sql, valores);
    return resultado.affectedRows > 0;
  };

  eliminar = async (id) => {
    const sql = "UPDATE encuestas SET activo = 0 WHERE encuesta_id = ?";
    const [resultado] = await conexion.execute(sql, [id]);
    return resultado.affectedRows > 0;
  };
}
