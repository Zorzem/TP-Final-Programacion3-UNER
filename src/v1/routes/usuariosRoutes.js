// src/v1/routes/usuariosRoutes.js
import express from "express";
import UsuariosController from "../../controllers/usuariosController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

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


router.get("/",autorizarUsuarios([1]), usuariosController.buscarTodos);
router.get("/:id",autorizarUsuarios([1]), usuariosController.buscarPorId);

router.post("/",autorizarUsuarios([1]), 
    [
        check("nombre", "El nombre es obligatorio.").notEmpty(),
        check("apellido", "El apellido es obligatorio.").notEmpty(),
        check("nombre_usuario", "El nombre de usuario es obligatorio.").notEmpty(),
        check("contrasenia", "La contraseña es obligatoria.").notEmpty(),
        check("tipo_usuario", "El tipo de usuario es obligatorio.").notEmpty().isInt(),
        check("celular").optional().isMobilePhone("es-AR").withMessage("El celular no es válido."),
        validarCampos,
    ],
    usuariosController.crear);

router.put("/:id",autorizarUsuarios([1]), 
    [
        check("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío."),
        check("apellido").optional().notEmpty().withMessage("El apellido no puede estar vacío."),
        check("nombre_usuario").optional().notEmpty().withMessage("El nombre de usuario no puede estar vacío."),
        check("contrasenia").optional().notEmpty().withMessage("La contraseña no puede estar vacía."),
        check("tipo_usuario").optional().isInt().withMessage("El tipo de usuario debe ser un número."),
        check("celular").optional().isMobilePhone("es-AR").withMessage("El celular no es válido."),
        validarCampos,
    ],
    usuariosController.editar);

router.delete("/:id",autorizarUsuarios([1]), usuariosController.eliminar);


export default router;
