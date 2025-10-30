import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import TurnosService from "../services/turnosService.js";

export default class TurnosController {
  constructor() {
    this.turnosService = new TurnosService();
  }

  buscarTodos = async (req, res) => {
    try {
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";
      const turnos = await this.turnosService.buscarTodos(incluir);
      return successResponse(res, turnos, "Turnos encontrados");
    } catch (error) {
      console.log("Error en GET /turnos", error);
      return errorResponse(res);
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const turno = await this.turnosService.buscarPorId(id);
      if (!turno) return notFoundResponse(res, `Turno con ID ${id} no encontrado`);
      return successResponse(res, turno, "Turno encontrado");
    } catch (error) {
      console.log(`Error en GET /turnos/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  crear = async (req, res) => {
    try {
      const { orden, hora_desde, hora_hasta } = req.body;

      const faltantes = [];
      if (!orden) faltantes.push("orden");
      if (!hora_desde) faltantes.push("hora_desde");
      if (!hora_hasta) faltantes.push("hora_hasta");

      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      const nuevoTurnoId = await this.turnosService.crear({ orden, hora_desde, hora_hasta });
      return successResponse(res, { id: nuevoTurnoId }, "Turno creado con éxito", 201);
    } catch (error) {
      console.log("Error en POST /turnos", error);
      return errorResponse(res);
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const camposValidos = ["orden", "hora_desde", "hora_hasta", "activo"];
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

      const actualizado = await this.turnosService.editar(id, req.body);
      if (!actualizado) return notFoundResponse(res, `Turno con ID ${id} no encontrado`);

      return successResponse(res, null, `Turno con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.log(`Error en PUT /turnos/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.turnosService.eliminar(id);
      if (resultado && resultado.affectedRows === 0) return notFoundResponse(res, `Turno con ID ${id} no encontrado`);
      return successResponse(res, null, `Turno con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log("Error en DELETE /turnos/:id", error);
      return errorResponse(res);
    }
  };
}
