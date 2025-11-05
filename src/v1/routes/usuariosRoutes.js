// src/v1/routes/usuariosRoutes.js

import express from "express";
import UsuariosController from "../../controllers/usuariosController.js";

const router = express.Router();
const usuariosController = new UsuariosController();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
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
 *                       usuario_id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Juan"
 *                       apellido:
 *                         type: string
 *                         example: "Pérez"
 *                       nombre_usuario:
 *                         type: string
 *                         example: "juanp"
 *                       tipo_usuario:
 *                         type: number
 *                         example: 1
 *                       celular:
 *                         type: string
 *                         example: "123456789"
 *                       foto:
 *                         type: string
 *                         example: "foto.jpg"
 *                       activo:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombre_usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: number
 *               celular:
 *                 type: string
 *               foto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o incompletos
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Edita un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombre_usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: number
 *               celular:
 *                 type: string
 *               foto:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Campos inválidos
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

router.get("/", usuariosController.buscarTodos);
router.get("/:id", usuariosController.buscarPorId);
router.post("/", usuariosController.crear);
router.put("/:id", usuariosController.editar);
router.delete("/:id", usuariosController.eliminar);

export default router;
