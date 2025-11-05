// src/controllers/reservasController.js

import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import ReservasService from "../services/reservasService.js";

export default class ReservasController {
  constructor() {
    this.reservasService = new ReservasService();
  }

  /*   buscarTodos = async (req, res) => {
    try {
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";
      const reservas = await this.reservasService.buscarTodos(incluir,req.usuar);
      const incluir = String(req.query.incluirInactivos) === "true";
      const reservas = await this.reservasService.buscarTodos(incluir);
      return successResponse(res, reservas, "Reservas encontradas");
    } catch (error) {
      console.error("Error en GET /reservas:", error);
      return errorResponse(res);
    }
  }; */

  buscarTodos = async (req, res) => {
    try {
      const reservas = await this.reservasService.buscarTodos(req.user);

      res.json({
        estado: true,
        datos: reservas,
      });
    } catch (err) {
      console.log("Error en GET /reservas", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await this.reservasService.buscarPorId(id);
      if (!reserva) return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);

      const servicios = await this.reservasService.obtenerServicios(id);
      reserva.servicios = servicios;

      return successResponse(res, reserva, "Reserva encontrada");
    } catch (error) {
      console.error(`Error en GET /reservas/${req.params.id}:`, error);
      return errorResponse(res);
    }
  };

  crear = async (req, res) => {
    try {
      let { fecha_reserva, salon_id, usuario_id, turno_id, tematica, importe_salon, servicios } = req.body;

      const faltantes = [];
      if (!fecha_reserva) faltantes.push("fecha_reserva");
      if (!salon_id) faltantes.push("salon_id");
      if (!usuario_id) faltantes.push("usuario_id");
      if (!turno_id) faltantes.push("turno_id");
      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
      if (!formatoValido.test(fecha_reserva)) {
        return errorResponse(res, "Formato de fecha inválido, usá YYYY-MM-DD", 400);
      }
      const [y, m, d] = fecha_reserva.split("-").map(Number);
      const fechaTest = new Date(fecha_reserva + "T00:00:00Z");
      if (
        Number.isNaN(fechaTest.getTime()) ||
        fechaTest.getUTCFullYear() !== y ||
        fechaTest.getUTCMonth() + 1 !== m ||
        fechaTest.getUTCDate() !== d
      ) {
        return errorResponse(res, "Fecha inválida", 400);
      }

      salon_id = Number(salon_id);
      usuario_id = Number(usuario_id);
      turno_id = Number(turno_id);
      if ([salon_id, usuario_id, turno_id].some((n) => !Number.isInteger(n))) {
        return errorResponse(res, "IDs inválidos (deben ser enteros)", 400);
      }

      const foto_cumpleaniero = req.file ? req.file.filename : null;

      let serviciosProcesados = [];
      if (typeof servicios === "string" && servicios.trim() !== "") {
        try {
          const parsed = JSON.parse(servicios);
          if (Array.isArray(parsed)) serviciosProcesados = parsed;
        } catch (e) {
          console.warn("No se pudo parsear 'servicios':", servicios);
        }
      } else if (Array.isArray(servicios)) {
        serviciosProcesados = servicios;
      }

      const nuevoId = await this.reservasService.crear({
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica: tematica ?? null,
        importe_salon: importe_salon ?? null,
        servicios: serviciosProcesados,
      });

      return successResponse(res, { id: nuevoId }, "Reserva creada con éxito", 201);
    } catch (error) {
      console.error("Error en POST /reservas:", error);
      return errorResponse(res, error.message, 500);
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;

      const camposValidos = [
        "fecha_reserva",
        "salon_id",
        "usuario_id",
        "turno_id",
        "foto_cumpleaniero",
        "tematica",
        "importe_salon",
        "activo",
        "servicios",
      ];

      const datos = { ...req.body };

      if (req.file) datos.foto_cumpleaniero = req.file.filename;

      if (typeof datos.servicios === "string" && datos.servicios.trim() !== "") {
        try {
          const parsed = JSON.parse(datos.servicios);
          if (Array.isArray(parsed)) datos.servicios = parsed;
        } catch (e) {
          return errorResponse(res, "Formato inválido de 'servicios'", 400);
        }
      }

      const camposRecibidos = Object.keys(datos);
      if (camposRecibidos.length === 0) {
        return errorResponse(res, "No se enviaron campos para actualizar", 400);
      }
      const invalidos = camposRecibidos.filter((campo) => !camposValidos.includes(campo));
      if (invalidos.length > 0) {
        return errorResponse(
          res,
          `Campos inválidos: ${invalidos.join(", ")}. Campos permitidos: ${camposValidos.join(", ")}`,
          400
        );
      }

      ["salon_id", "usuario_id", "turno_id"].forEach((k) => {
        if (k in datos && datos[k] !== null && datos[k] !== "") {
          const n = Number(datos[k]);
          if (!Number.isInteger(n)) {
            throw new Error(`El campo ${k} debe ser un entero`);
          }
          datos[k] = n;
        }
      });

      if ("fecha_reserva" in datos) {
        const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
        if (!formatoValido.test(datos.fecha_reserva)) {
          return errorResponse(res, "Formato de fecha inválido, usá YYYY-MM-DD", 400);
        }
        const [y, m, d] = datos.fecha_reserva.split("-").map(Number);
        const fechaTest = new Date(datos.fecha_reserva + "T00:00:00Z");
        if (
          Number.isNaN(fechaTest.getTime()) ||
          fechaTest.getUTCFullYear() !== y ||
          fechaTest.getUTCMonth() + 1 !== m ||
          fechaTest.getUTCDate() !== d
        ) {
          return errorResponse(res, "Fecha inválida", 400);
        }
      }

      const actualizado = await this.reservasService.editar(id, datos);
      if (!actualizado) return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);

      return successResponse(res, null, `Reserva con ID ${id} actualizada correctamente`);
    } catch (error) {
      console.error(`Error en PUT /reservas/${req.params.id}:`, error);
      const msg = error?.message || "Error interno";
      return errorResponse(res, msg);
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.reservasService.eliminar(id);
      if (resultado?.affectedRows === 0) {
        return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);
      }
      return successResponse(res, null, `Reserva con ID ${id} eliminada correctamente`);
    } catch (error) {
      console.error("Error en DELETE /reservas/:id:", error);
      return errorResponse(res);
    }
  };
}
