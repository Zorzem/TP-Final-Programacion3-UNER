import { conexion } from "./conexion.js";

export default class Reservas {
  buscarTodos = async (incluirInactivos = false) => {
    let sql = `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        s.importe AS importe_salon,
        (s.importe + IFNULL((
          SELECT SUM(sv.importe)
          FROM reservas_servicios rs
          INNER JOIN servicios sv ON rs.servicio_id = sv.servicio_id
          WHERE rs.reserva_id = r.reserva_id
        ), 0)) AS importe_total,
        r.activo,
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

    if (!incluirInactivos) sql += " WHERE r.activo = 1";
    sql += " ORDER BY r.reserva_id ASC";

    const [reservas] = await conexion.execute(sql);
    return reservas;
  };

  buscarPorId = async (id) => {
    if (!id || isNaN(id)) throw new Error("ID inválido");
    const sql = `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        s.importe AS importe_salon,
        (s.importe + IFNULL((
          SELECT SUM(sv.importe)
          FROM reservas_servicios rs
          INNER JOIN servicios sv ON rs.servicio_id = sv.servicio_id
          WHERE rs.reserva_id = r.reserva_id
        ), 0)) AS importe_total,
        r.activo,
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
    `;
    const [rows] = await conexion.execute(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  };

  crear = async ({
    fecha_reserva,
    salon_id,
    usuario_id,
    turno_id,
    foto_cumpleaniero = null,
    tematica = null,
    servicios = [],
  }) => {
    if (!salon_id || !usuario_id || !turno_id) {
      throw new Error("Datos insuficientes para crear reserva");
    }

    const [salonRows] = await conexion.execute(
      "SELECT importe FROM salones WHERE salon_id = ?",
      [salon_id]
    );
    if (salonRows.length === 0)
      throw new Error(`El salón con ID ${salon_id} no existe`);
    const importeSalon = parseFloat(salonRows[0].importe);

    const listaServicios = this.#parsearServicios(servicios);

    let totalServicios = 0;
    for (const s of listaServicios) {
      const id = typeof s === "object" ? s.servicio_id : s;
      const [servicioRows] = await conexion.execute(
        "SELECT importe FROM servicios WHERE servicio_id = ?",
        [id]
      );
      if (servicioRows.length > 0)
        totalServicios += parseFloat(servicioRows[0].importe);
    }

    const importeTotal = importeSalon + totalServicios;

    const sql = `
      INSERT INTO reservas
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conexion.execute(sql, [
      fecha_reserva ?? null,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importeSalon,
      importeTotal,
    ]);

    const reservaId = result.insertId;

    for (const s of listaServicios) {
      const id = typeof s === "object" ? s.servicio_id : s;
      const [servRow] = await conexion.execute(
        "SELECT importe FROM servicios WHERE servicio_id = ?",
        [id]
      );
      const importeServicio =
        servRow.length > 0 ? servRow[0].importe : 0;
      await conexion.execute(
        "INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)",
        [reservaId, id, importeServicio]
      );
    }

    return reservaId;
  };

  editar = async (id, datos) => {
    if (!id || isNaN(id)) throw new Error("ID inválido");

    const [existe] = await conexion.execute(
      "SELECT * FROM reservas WHERE reserva_id = ?",
      [id]
    );
    if (existe.length === 0) return false;

    let importeSalon = existe[0].importe_salon;
    if (datos.salon_id) {
      const [salonRows] = await conexion.execute(
        "SELECT importe FROM salones WHERE salon_id = ?",
        [datos.salon_id]
      );
      if (salonRows.length > 0)
        importeSalon = parseFloat(salonRows[0].importe);
    }

    const listaServicios = this.#parsearServicios(datos.servicios);
    let totalServicios = 0;
    for (const s of listaServicios) {
      const id = typeof s === "object" ? s.servicio_id : s;
      const [servicioRows] = await conexion.execute(
        "SELECT importe FROM servicios WHERE servicio_id = ?",
        [id]
      );
      if (servicioRows.length > 0)
        totalServicios += parseFloat(servicioRows[0].importe);
    }

    const importeTotal = importeSalon + totalServicios;
    datos.importe_salon = importeSalon;
    datos.importe_total = importeTotal;

    const campos = [];
    const valores = [];
    const permitidos = [
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
      if (permitidos.includes(campo) && valor !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(valor);
      }
    }

    if (campos.length > 0) {
      const sql = `UPDATE reservas SET ${campos.join(", ")} WHERE reserva_id = ?`;
      valores.push(id);
      await conexion.execute(sql, valores);
    }

    await conexion.execute("DELETE FROM reservas_servicios WHERE reserva_id = ?", [id]);
    for (const s of listaServicios) {
      const idServ = typeof s === "object" ? s.servicio_id : s;
      const [servRow] = await conexion.execute(
        "SELECT importe FROM servicios WHERE servicio_id = ?",
        [idServ]
      );
      const importeServicio = servRow.length > 0 ? servRow[0].importe : 0;
      await conexion.execute(
        "INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)",
        [id, idServ, importeServicio]
      );
    }

    return true;
  };

  eliminar = async (id) => {
    const [resultado] = await conexion.execute(
      "UPDATE reservas SET activo = 0 WHERE reserva_id = ?",
      [id]
    );
    return resultado;
  };

  obtenerServiciosDeReserva = async (reserva_id) => {
    const sql = `
      SELECT 
        rs.reserva_servicio_id,
        rs.servicio_id,
        s.descripcion,
        s.importe AS importe_servicio
      FROM reservas_servicios rs
      INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
      WHERE rs.reserva_id = ?
      ORDER BY rs.reserva_servicio_id ASC
    `;
    const [rows] = await conexion.execute(sql, [reserva_id]);
    return rows;
  };

  #parsearServicios(servicios) {
    if (!servicios) return [];
    if (Array.isArray(servicios)) return servicios;
    if (typeof servicios === "string") {
      try {
        const parsed = JSON.parse(servicios);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        console.warn("⚠️ Error al parsear 'servicios':", servicios);
      }
    }
    return [];
  }
}
