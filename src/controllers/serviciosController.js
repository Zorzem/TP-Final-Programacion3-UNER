import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import ServiciosService from "../services/serviciosService.js";

export default class ServiciosController {
  constructor() {
    this.serviciosService = new ServiciosService();
  }

  buscarTodos = async (req, res) => {
    try {
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";

      const servicios = await this.serviciosService.buscarTodos(incluir);

      return successResponse(res, servicios, "Servicios encontrados");
    } catch (error) {
      console.log("Error en GET /servicios", error);
      return errorResponse(res);
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await this.serviciosService.buscarPorId(id);

      if (!servicio) {
        return notFoundResponse(res, `Servicio con ID ${id} no encontrado`);
      }

      return successResponse(res, servicio, "Servicio encontrado");
    } catch (error) {
      console.log(`Error en GET /servicios/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const camposPermitidos = ["descripcion", "importe", "activo"];
      const camposRecibidos = Object.keys(req.body);

      // validar campos no permitidos
      const camposInvalidos = camposRecibidos.filter((campo) => !camposPermitidos.includes(campo));
      if (camposInvalidos.length > 0) {
        return errorResponse(res, `Campos incorrectos: ${camposInvalidos.join(", ")}`, 400);
      }

      const { descripcion, importe, activo } = req.body;

      if (descripcion === undefined && importe === undefined && activo === undefined) {
        return errorResponse(res, "Debés proporcionar al menos un campo para actualizar", 400);
      }

      // validar que el importe sea un num
      if (importe !== undefined && (isNaN(importe) || typeof Number(importe) !== "number")) {
        return errorResponse(res, "El campo 'importe' debe ser numérico", 400);
      }

      const actualizado = await this.serviciosService.editar(id, {
        descripcion,
        importe,
        activo,
      });

      if (!actualizado) {
        return notFoundResponse(res, `Servicio con ID ${id} no encontrado`);
      }

      return successResponse(res, null, `Servicio con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.log(`Error en PUT /servicios/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  crear = async (req, res) => {
    try {
      const { descripcion, importe } = req.body;

      if (!descripcion || !importe) {
        return errorResponse(res, "Faltan datos obligatorios: descripción e importe", 400);
      }

      const nuevoServicioId = await this.serviciosService.crear(descripcion, importe);

      return successResponse(res, { id: nuevoServicioId }, "Servicio creado con éxito", 201);
    } catch (error) {
      console.log("Error en POST /servicios", error);
      return errorResponse(res);
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, "ID del servicio es requerido", 400);
      }

      const resultado = await this.serviciosService.eliminar(id);
      if (resultado && resultado.affectedRows === 0) {
        return notFoundResponse(res, `Servicio con ID ${id} no encontrado`);
      }

      return successResponse(res, null, `Servicio con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log("Error en DELETE /servicios/:id", error);
      return errorResponse(res);
    }
  };
}
