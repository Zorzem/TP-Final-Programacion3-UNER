import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import EncuestasService from "../services/encuestasService.js";

export default class EncuestasController {
    constructor() {
        this.encuestasService = new EncuestasService();
    }

    /**
     * @swagger
     * /api/v1/encuestas:
     *   get:
     *     summary: Obtiene la lista de todas las encuestas.
     *     tags: [Encuestas]
     *     security:
     *       - jwtAuth: []
     *     responses:
     *       200:
     *         description: Lista de encuestas.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas/{id}:
     *   get:
     *     summary: Obtiene una encuesta por ID.
     *     tags: [Encuestas]
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
     *         description: Encuesta encontrada.
     *       404:
     *         description: Encuesta no encontrada.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas/usuario/{usuarioId}:
     *   get:
     *     summary: Obtiene las encuestas de un usuario específico.
     *     tags: [Encuestas]
     *     security:
     *       - jwtAuth: []
     *     parameters:
     *       - in: path
     *         name: usuarioId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de encuestas del usuario.
     *       400:
     *         description: ID de usuario no especificado.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas/salon/{salonId}:
     *   get:
     *     summary: Obtiene las encuestas de un salón específico.
     *     tags: [Encuestas]
     *     security:
     *       - jwtAuth: []
     *     parameters:
     *       - in: path
     *         name: salonId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de encuestas del salón.
     *       400:
     *         description: ID de salón no especificado.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas:
     *   post:
     *     summary: Crea una nueva encuesta.
     *     tags: [Encuestas]
     *     security:
     *       - jwtAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EncuestaCreate'
     *     responses:
     *       201:
     *         description: Encuesta creada con éxito.
     *       400:
     *         description: Faltan datos obligatorios.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas/{id}:
     *   put:
     *     summary: Actualiza una encuesta existente.
     *     tags: [Encuestas]
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
     *             $ref: '#/components/schemas/EncuestaUpdate'
     *     responses:
     *       200:
     *         description: Encuesta actualizada con éxito.
     *       400:
     *         description: Error en la validación de datos.
     *       404:
     *         description: Encuesta no encontrada.
     *       500:
     *         description: Error interno del servidor.
     */
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

    /**
     * @swagger
     * /api/v1/encuestas/{id}:
     *   delete:
     *     summary: Elimina una encuesta (eliminación lógica).
     *     tags: [Encuestas]
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
     *         description: Encuesta eliminada con éxito.
     *       404:
     *         description: Encuesta no encontrada.
     *       500:
     *         description: Error interno del servidor.
     */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Encuesta:
 *       type: object
 *       properties:
 *         encuesta_id:
 *           type: integer
 *         reserva_id:
 *           type: integer
 *         puntaje:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comentario:
 *           type: string
 *         activo:
 *           type: boolean
 *         creado:
 *           type: string
 *           format: date-time
 *         modificado:
 *           type: string
 *           format: date-time
 *     EncuestaCreate:
 *       type: object
 *       required:
 *         - reserva_id
 *         - puntaje
 *       properties:
 *         reserva_id:
 *           type: integer
 *         puntaje:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comentario:
 *           type: string
 *     EncuestaUpdate:
 *       type: object
 *       properties:
 *         puntaje:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comentario:
 *           type: string
 *         activo:
 *           type: boolean
 */
