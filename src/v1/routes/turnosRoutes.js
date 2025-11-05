// src/v1/routes/turnosRoutes.js

import express from "express";
import TurnosController from "../../controllers/turnosController.js";

const turnosController = new TurnosController();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos disponibles y sus horarios
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtiene la lista completa de turnos
 *     tags: [Turnos]
 *     parameters:
 *       - in: query
 *         name: incluirInactivos
 *         schema:
 *           type: boolean
 *         description: Incluir turnos inactivos en la respuesta
 *         example: false
 *     responses:
 *       200:
 *         description: Lista de turnos encontrados
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
 *                       turno_id:
 *                         type: integer
 *                         example: 1
 *                       orden:
 *                         type: integer
 *                         example: 1
 *                       hora_desde:
 *                         type: string
 *                         example: "10:00:00"
 *                       hora_hasta:
 *                         type: string
 *                         example: "12:00:00"
 *                       activo:
 *                         type: boolean
 *                         example: true
 */

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Busca un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
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
 *                     turno_id:
 *                       type: integer
 *                       example: 2
 *                     orden:
 *                       type: integer
 *                       example: 2
 *                     hora_desde:
 *                       type: string
 *                       example: "14:00:00"
 *                     hora_hasta:
 *                       type: string
 *                       example: "16:00:00"
 *                     activo:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orden
 *               - hora_desde
 *               - hora_hasta
 *             properties:
 *               orden:
 *                 type: integer
 *                 example: 3
 *               hora_desde:
 *                 type: string
 *                 example: "18:00:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "20:00:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Edita un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: integer
 *                 example: 1
 *               hora_desde:
 *                 type: string
 *                 example: "09:00:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "11:00:00"
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Desactiva un turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a desactivar
 *     responses:
 *       200:
 *         description: Turno desactivado correctamente
 *       404:
 *         description: Turno no encontrado
 */

router.get("/", turnosController.buscarTodos);
router.get("/:id", turnosController.buscarPorId);
router.post("/", turnosController.crear);
router.put("/:id", turnosController.editar);
router.delete("/:id", turnosController.eliminar);

export default router;
