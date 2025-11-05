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
      return successResponse(res, reservas, "Reservas encontradas");
    } catch (error) {
      console.log("Error en GET /reservas", error);
      return errorResponse(res);
    }
  }; */

  buscarTodos = async (req, res) => {
      try {

          const reservas = await this.reservasService.buscarTodos(req.user);

          res.json({
              estado: true, 
              datos: reservas
          });
  
      } catch (err) {
          console.log('Error en GET /reservas', err);
          res.status(500).json({
              estado: false,
              mensaje: 'Error interno del servidor.'
          });
      }
  }



  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await this.reservasService.buscarPorId(id);
      if (!reserva) return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);

      // agregar servicios asociados
      const servicios = await this.reservasService.obtenerServicios(id);
      reserva.servicios = servicios;

      return successResponse(res, reserva, "Reserva encontrada");
    } catch (error) {
      console.log(`Error en GET /reservas/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  crear = async (req, res) => {
    try {
      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      } = req.body;

      const faltantes = [];
      if (!fecha_reserva) faltantes.push("fecha_reserva");
      if (!salon_id) faltantes.push("salon_id");
      if (!usuario_id) faltantes.push("usuario_id");
      if (!turno_id) faltantes.push("turno_id");

      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      // validar fecha (mysql usa YYYY-MM-DD)
      const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
      if (!formatoValido.test(fecha_reserva)) {
        return errorResponse(res, "Formato de fecha inválido, usá YYY-MM-DD", 400);
      }

      // validar que los ID sean números
      if (isNaN(salon_id) || isNaN(usuario_id) || isNaN(turno_id)) {
        return errorResponse(res, "Los IDs deben ser numéricos", 400);
      }

      const nuevoId = await this.reservasService.crear({
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero: foto_cumpleaniero ?? null,
        tematica: tematica ?? null,
        importe_salon: importe_salon ?? null,
        importe_total: importe_total ?? null,
        servicios: Array.isArray(servicios) ? servicios : null,
      });

      return successResponse(res, { id: nuevoId }, "Reserva creada con éxito", 201);
    } catch (error) {
      console.log("Error en POST /reservas", error);
      // si un FK no existe devuelve 400
      if (typeof error.message === "string" && error.message.includes("no existe")) {
        return errorResponse(res, error.message, 400);
      }
      return errorResponse(res);
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
        "importe_total",
        "activo",
        "servicios",
      ];
      const camposRecibidos = Object.keys(req.body);

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

      const actualizado = await this.reservasService.editar(id, req.body);
      if (!actualizado) return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);

      return successResponse(res, null, `Reserva con ID ${id} actualizada correctamente`);
    } catch (error) {
      console.log(`Error en PUT /reservas/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.reservasService.eliminar(id);
      if (resultado && resultado.affectedRows === 0) return notFoundResponse(res, `Reserva con ID ${id} no encontrada`);
      return successResponse(res, null, `Reserva con ID ${id} eliminada correctamente`);
    } catch (error) {
      console.log("Error en DELETE /reservas/:id", error);
      return errorResponse(res);
    }
  };
}
