// src/controllers/encuestasController.js

import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import EncuestasService from "../services/encuestasService.js";

export default class EncuestasController {
  constructor() {
    this.encuestasService = new EncuestasService();
  }

  buscarTodos = async (req, res) => {
    try {
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";
      const encuestas = await this.encuestasService.buscarTodos(incluir);
      return successResponse(res, encuestas, "Encuestas encontradas");
    } catch (error) {
      console.log("Error en GET /encuestas", error);
      return errorResponse(res);
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const encuesta = await this.encuestasService.buscarPorId(id);
      if (!encuesta) return notFoundResponse(res, `Encuesta con ID ${id} no encontrada`);
      return successResponse(res, encuesta, "Encuesta encontrada");
    } catch (error) {
      console.log(`Error en GET /encuestas/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  buscarPorUsuario = async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";

      if (!usuarioId) {
        return errorResponse(res, "Debe especificar un ID de usuario", 400);
      }

      const encuestas = await this.encuestasService.buscarPorUsuario(usuarioId, incluir);
      return successResponse(res, encuestas, `Encuestas del usuario ${usuarioId}`);
    } catch (error) {
      console.log(`Error en GET /encuestas/usuario/${req.params.usuarioId}`, error);
      return errorResponse(res);
    }
  };

  buscarPorSalon = async (req, res) => {
    try {
      const { salonId } = req.params;
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";

      if (!salonId) {
        return errorResponse(res, "Debe especificar un ID de salón", 400);
      }

      const encuestas = await this.encuestasService.buscarPorSalon(salonId, incluir);
      return successResponse(res, encuestas, `Encuestas del salón ${salonId}`);
    } catch (error) {
      console.log(`Error en GET /encuestas/salon/${req.params.salonId}`, error);
      return errorResponse(res);
    }
  };

  crear = async (req, res) => {
    try {
      const { reserva_id, puntaje, comentario } = req.body;
      const faltantes = [];
      if (!reserva_id) faltantes.push("reserva_id");
      if (puntaje == null) faltantes.push("puntaje");

      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      const nuevaEncuestaId = await this.encuestasService.crear({
        reserva_id,
        puntaje,
        comentario: comentario ?? null,
      });

      return successResponse(res, { id: nuevaEncuestaId }, "Encuesta creada con éxito", 201);
    } catch (error) {
      console.log("Error en POST /encuestas", error);
      return errorResponse(res);
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { puntaje, comentario, activo } = req.body;
      const actualizado = await this.encuestasService.editar(id, {
        puntaje,
        comentario,
        activo,
      });

      if (!actualizado) {
        return notFoundResponse(res, `Encuesta con ID ${id} no encontrada`);
      }

      return successResponse(res, null, "Encuesta actualizada con éxito");
    } catch (error) {
      console.log(`Error en PUT /encuestas/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await this.encuestasService.eliminar(id);
      if (!eliminado) {
        return notFoundResponse(res, `Encuesta con ID ${id} no encontrada`);
      }
      return successResponse(res, null, "Encuesta eliminada con éxito");
    } catch (error) {
      console.log(`Error en DELETE /encuestas/${req.params.id}`, error);
      return errorResponse(res);
    }
  };
}
