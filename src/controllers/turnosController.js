import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import TurnosService from "../services/turnosService.js";

export default class TurnosController {
  constructor() {
    this.turnosService = new TurnosService();
  }

  /**
   * @swagger
   * /api/v1/turnos:
   *   get:
   *     summary: Obtiene la lista de todos los turnos.
   *     tags: [Turnos]
   *     security:
   *       - jwtAuth: []
   *     responses:
   *       200:
   *         description: Lista de turnos.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/turnos/{id}:
   *   get:
   *     summary: Obtiene un turno por ID.
   *     tags: [Turnos]
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
   *         description: Turno encontrado.
   *       404:
   *         description: Turno no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/turnos:
   *   post:
   *     summary: Crea un nuevo turno.
   *     tags: [Turnos]
   *     security:
   *       - jwtAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TurnoCreate'
   *     responses:
   *       201:
   *         description: Turno creado con éxito.
   *       400:
   *         description: Faltan datos obligatorios.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/turnos/{id}:
   *   put:
   *     summary: Actualiza un turno existente.
   *     tags: [Turnos]
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
   *             $ref: '#/components/schemas/TurnoUpdate'
   *     responses:
   *       200:
   *         description: Turno actualizado correctamente.
   *       400:
   *         description: Error en la validación de datos.
   *       404:
   *         description: Turno no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

  /**
   * @swagger
   * /api/v1/turnos/{id}:
   *   delete:
   *     summary: Elimina un turno (eliminación lógica).
   *     tags: [Turnos]
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
   *         description: Turno eliminado correctamente.
   *       404:
   *         description: Turno no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         turno_id:
 *           type: integer
 *         orden:
 *           type: integer
 *         hora_desde:
 *           type: string
 *           format: time
 *         hora_hasta:
 *           type: string
 *           format: time
 *         activo:
 *           type: boolean
 *         creado:
 *           type: string
 *           format: date-time
 *         modificado:
 *           type: string
 *           format: date-time
 *     TurnoCreate:
 *       type: object
 *       required:
 *         - orden
 *         - hora_desde
 *         - hora_hasta
 *       properties:
 *         orden:
 *           type: integer
 *         hora_desde:
 *           type: string
 *           format: time
 *         hora_hasta:
 *           type: string
 *           format: time
 *     TurnoUpdate:
 *       type: object
 *       properties:
 *         orden:
 *           type: integer
 *         hora_desde:
 *           type: string
 *           format: time
 *         hora_hasta:
 *           type: string
 *           format: time
 *         activo:
 *           type: boolean
 */
