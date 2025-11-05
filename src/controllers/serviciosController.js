import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import ServiciosService from "../services/serviciosService.js";

export default class ServiciosController {
  constructor() {
    this.serviciosService = new ServiciosService();
  }

  /**
   * @swagger
   * /api/v1/servicios:
   *   get:
   *     summary: Obtiene la lista de todos los servicios.
   *     tags: [Servicios]
   *     security:
   *       - jwtAuth: []
   *     responses:
   *       200:
   *         description: Lista de servicios.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/servicios/{id}:
   *   get:
   *     summary: Obtiene un servicio por ID.
   *     tags: [Servicios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Servicio encontrado.
   *       404:
   *         description: Servicio no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/servicios/{id}:
   *   put:
   *     summary: Actualiza un servicio existente.
   *     tags: [Servicios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ServicioUpdate'
   *     responses:
   *       200:
   *         description: Servicio actualizado correctamente.
   *       400:
   *         description: Error en la validación de datos.
   *       404:
   *         description: Servicio no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/servicios:
   *   post:
   *     summary: Crea un nuevo servicio.
   *     tags: [Servicios]
   *     security:
   *       - jwtAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ServicioCreate'
   *     responses:
   *       201:
   *         description: Servicio creado con éxito.
   *       400:
   *         description: Faltan datos obligatorios.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/servicios/{id}:
   *   delete:
   *     summary: Elimina un servicio (eliminación lógica).
   *     tags: [Servicios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Servicio eliminado correctamente.
   *       400:
   *         description: ID del servicio es requerido.
   *       404:
   *         description: Servicio no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         servicio_id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         importe:
 *           type: number
 *         activo:
 *           type: boolean
 *         creado:
 *           type: string
 *           format: date-time
 *         modificado:
 *           type: string
 *           format: date-time
 *     ServicioCreate:
 *       type: object
 *       required:
 *         - descripcion
 *         - importe
 *       properties:
 *         descripcion:
 *           type: string
 *         importe:
 *           type: number
 *     ServicioUpdate:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *         importe:
 *           type: number
 *         activo:
 *           type: boolean
 */
