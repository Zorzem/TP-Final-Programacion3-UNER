// src/v1/routes/encuestasRoutes.js

import express from "express";
import EncuestasController from "../../controllers/encuestasController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const encuestasController = new EncuestasController();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Encuestas
 *   description: Gestión de encuestas realizadas por usuarios en los salones
 */

/**
 * @swagger
 * /encuestas:
 *   get:
 *     summary: Obtiene todas las encuestas
 *     tags: [Encuestas]
 *     responses:
 *       200:
 *         description: Lista de todas las encuestas registradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   usuarioId:
 *                     type: integer
 *                     example: 12
 *                   salonId:
 *                     type: integer
 *                     example: 3
 *                   puntuacion:
 *                     type: integer
 *                     example: 5
 *                   comentario:
 *                     type: string
 *                     example: "Excelente servicio"
 */

/**
 * @swagger
 * /encuestas/{id}:
 *   get:
 *     summary: Obtiene una encuesta por su ID
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la encuesta
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /encuestas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtiene las encuestas realizadas por un usuario específico
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Encuestas del usuario
 */

/**
 * @swagger
 * /encuestas/salon/{salonId}:
 *   get:
 *     summary: Obtiene las encuestas asociadas a un salón
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Encuestas del salón
 */

/**
 * @swagger
 * /encuestas:
 *   post:
 *     summary: Crea una nueva encuesta
 *     tags: [Encuestas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - salonId
 *               - puntuacion
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 12
 *               salonId:
 *                 type: integer
 *                 example: 3
 *               puntuacion:
 *                 type: integer
 *                 example: 4
 *               comentario:
 *                 type: string
 *                 example: "Muy buena atención"
 *     responses:
 *       201:
 *         description: Encuesta creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /encuestas/{id}:
 *   put:
 *     summary: Edita una encuesta existente
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la encuesta a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               puntuacion:
 *                 type: integer
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 example: "Excelente, volveré sin dudarlo"
 *     responses:
 *       200:
 *         description: Encuesta actualizada correctamente
 *       404:
 *         description: Encuesta no encontrada
 */

/**
 * @swagger
 * /encuestas/{id}:
 *   delete:
 *     summary: Elimina una encuesta
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la encuesta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta eliminada correctamente
 *       404:
 *         description: Encuesta no encontrada
 */

router.get("/", autorizarUsuarios([1]), encuestasController.buscarTodos);
router.get("/:id", autorizarUsuarios([1]), encuestasController.buscarPorId);
router.get("/usuario/:usuarioId", autorizarUsuarios([1]), encuestasController.buscarPorUsuario);
router.get("/salon/:salonId", autorizarUsuarios([1]), encuestasController.buscarPorSalon);

router.post("/", autorizarUsuarios([3]), 
    [
        check("reserva_id", "El ID de la reserva es obligatorio y debe ser un número.")
        .notEmpty()
        .isInt(),
        check("puntaje", "El puntaje es obligatorio y debe ser un número entre 1 y 5.")
        .notEmpty()
        .isInt({ min: 1, max: 5 }),
        check("comentario").optional().isString().withMessage("El comentario debe ser un texto."),
        validarCampos,
    ],
    encuestasController.crear);

// Comento el endpoint de edicion y eliminacion ya que no se deberian poder modificar o eliminar las encuestas una vez creadas
//router.put("/:id", autorizarUsuarios([1]), encuestasController.editar);
//router.delete("/:id", autorizarUsuarios([1]), encuestasController.eliminar);


export default router;
