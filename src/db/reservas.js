import { conexion } from "./conexion.js";

export default class Reservas {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = `
      SELECT 
        r.*,
        s.titulo AS salon,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        t.hora_desde,
        t.hora_hasta
      FROM reservas r
      INNER JOIN salones s ON r.salon_id = s.salon_id
      INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
      INNER JOIN turnos t ON r.turno_id = t.turno_id
    `;
    if (!incluirInactivos) {
      sql += " WHERE r.activo = 1";
    }
    sql += " ORDER BY r.fecha_reserva DESC, r.reserva_id DESC";

    const [reservas] = await conexion.execute(sql);
    return reservas;
  };



  buscarPorId = async(reserva_id) => {
    const sql = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
    const [reserva] = await conexion.execute(sql, [reserva_id]);
    if(reserva.length === 0){
        return null;
    }

    return reserva[0];
}
/*   buscarPorId = async (id) => {
    const sql = `
      SELECT 
        r.*,
        s.titulo AS salon,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        t.hora_desde,
        t.hora_hasta
      FROM reservas r
      INNER JOIN salones s ON r.salon_id = s.salon_id
      INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
      INNER JOIN turnos t ON r.turno_id = t.turno_id
      WHERE r.reserva_id = ?
      LIMIT 1
    `;
    const [rows] = await conexion.execute(sql, [id]);
    return rows[0] || null;
  }; */

  crear = async ({
    fecha_reserva,
    salon_id,
    usuario_id,
    turno_id,
    foto_cumpleaniero = null,
    tematica = null,
    importe_salon = null,
    importe_total = null,
    servicios = null, // opcional: [{ servicio_id, importe }, ...]
  }) => {
    const sql = `
      INSERT INTO reservas
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conexion.execute(sql, [
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    ]);

    const reservaId = result.insertId;

    // Si enviaron servicios, insertarlos en reservas_servicios
    if (Array.isArray(servicios) && servicios.length > 0) {
      const valores = servicios.map((s) => [reservaId, s.servicio_id, s.importe ?? 0]).flat();
      // Armamos query de múltiples inserts
      // INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?), (?, ?, ?), ...
      const placeholders = servicios.map(() => "(?, ?, ?)").join(", ");
      const sqlServicios = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES ${placeholders}`;
      await conexion.execute(sqlServicios, servicios.flatMap((s) => [reservaId, s.servicio_id, s.importe ?? 0]));
    }

    return reservaId;
  };

  editar = async (id, datos) => {
    const [existe] = await conexion.execute("SELECT * FROM reservas WHERE reserva_id = ?", [id]);
    if (existe.length === 0) return false;

    const campos = [];
    const valores = [];

    // Permitidos según esquema
    const camposPermitidos = [
      "fecha_reserva",
      "salon_id",
      "usuario_id",
      "turno_id",
      "foto_cumpleaniero",
      "tematica",
      "importe_salon",
      "importe_total",
      "activo",
    ];

    for (const [campo, valor] of Object.entries(datos)) {
      if (campo === "servicios") continue; // manejar aparte si viene
      if (!camposPermitidos.includes(campo)) continue;
      if (valor !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(valor);
      }
    }

    if (campos.length > 0) {
      const sql = `UPDATE reservas SET ${campos.join(", ")} WHERE reserva_id = ?`;
      valores.push(id);
      const [result] = await conexion.execute(sql, valores);
      // si no hubo affectedRows puede seguir existiendo, igual devolvemos boolean
      if (result.affectedRows === 0) {
        // no cambiado
      }
    }

    // Si incluyeron "servicios" lo actualizamos: (simplificación) borramos los existentes y volvemos a insertar
    if (Array.isArray(datos.servicios)) {
      await conexion.execute("DELETE FROM reservas_servicios WHERE reserva_id = ?", [id]);
      if (datos.servicios.length > 0) {
        const sqlServicios = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES ${datos.servicios
          .map(() => "(?, ?, ?)")
          .join(", ")}`;
        const params = datos.servicios.flatMap((s) => [id, s.servicio_id, s.importe ?? 0]);
        await conexion.execute(sqlServicios, params);
      }
    }

    return true;
  };

  eliminar = async (id) => {
    const sql = "UPDATE reservas SET activo = 0 WHERE reserva_id = ?";
    const [resultado] = await conexion.execute(sql, [id]);
    return resultado;
  };

  obtenerServiciosDeReserva = async (reserva_id) => {
    const sql = `
      SELECT rs.*, s.descripcion, s.importe AS importe_servicio
      FROM reservas_servicios rs
      INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
      WHERE rs.reserva_id = ?
      ORDER BY rs.reserva_servicio_id ASC
    `;
    const [rows] = await conexion.execute(sql, [reserva_id]);
    return rows;
  };
}
