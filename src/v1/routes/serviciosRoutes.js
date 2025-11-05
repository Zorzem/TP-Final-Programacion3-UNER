// src/v1/routes/serviciosRoutes.js

import express from "express";
import ServiciosController from "../../controllers/serviciosController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const serviciosController = new ServiciosController();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Gestión de servicios disponibles en los salones
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtiene todos los servicios
 *     tags: [Servicios]
 *     parameters:
 *       - in: query
 *         name: incluirInactivos
 *         schema:
 *           type: boolean
 *         description: Incluir servicios inactivos
 *         example: false
 *     responses:
 *       200:
 *         description: Lista de servicios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       servicio_id:
 *                         type: integer
 *                         example: 1
 *                       descripcion:
 *                         type: string
 *                         example: "Decoración de cumpleaños"
 *                       importe:
 *                         type: number
 *                         example: 1500
 *                       activo:
 *                         type: boolean
 *                         example: true
 */

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtiene un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del servicio
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: object
 *                   properties:
 *                     servicio_id:
 *                       type: integer
 *                       example: 1
 *                     descripcion:
 *                       type: string
 *                       example: "Decoración de cumpleaños"
 *                     importe:
 *                       type: number
 *                       example: 1500
 *                     activo:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - importe
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Decoración temática"
 *               importe:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Edita un servicio existente
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del servicio a editar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /servicios/{id}:
 *   delete:
 *     summary: Desactiva un servicio (no lo elimina físicamente)
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del servicio a desactivar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio desactivado correctamente
 *       404:
 *         description: Servicio no encontrado
 */


router.get("/",autorizarUsuarios([1,2,3]), serviciosController.buscarTodos);
router.get("/:id",autorizarUsuarios([1,2,3]), serviciosController.buscarPorId);


router.post("/",autorizarUsuarios([1,2]), serviciosController.crear);
router.put("/:id",autorizarUsuarios([1,2]), serviciosController.editar);
router.delete("/:id",autorizarUsuarios([1,2]), serviciosController.eliminar);


export default router;
