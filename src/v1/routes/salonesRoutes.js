// src/v1/routes/salonesRoutes.js

import express from "express";
import apicache from "apicache";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import SalonesController from "../../controllers/salonesController.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import verificarToken from "../../middlewares/authJwt.js";
import auditarAccion from "../../middlewares/auditarAccion.js"; //

const salonesController = new SalonesController();
const router = express.Router();
let cache = apicache.middleware;

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Gestión de salones
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Obtiene todos los salones
 *     tags: [Salones]
 *     parameters:
 *       - in: query
 *         name: incluirInactivos
 *         schema:
 *           type: boolean
 *         description: Incluir salones inactivos
 *         example: false
 *     responses:
 *       200:
 *         description: Lista de salones encontrados
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Salón Principal"
 *                       direccion:
 *                         type: string
 *                         example: "Calle Falsa 123"
 *                       latitud:
 *                         type: number
 *                         example: -34.6037
 *                       longitud:
 *                         type: number
 *                         example: -58.3816
 *                       capacidad:
 *                         type: integer
 *                         example: 50
 *                       importe:
 *                         type: number
 *                         example: 5000
 */

/**
 * @swagger
 * /salones/{id}:
 *   get:
 *     summary: Obtiene un salón por su ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del salón
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salón encontrado
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Salón Principal"
 *                     direccion:
 *                       type: string
 *                       example: "Calle Falsa 123"
 *                     latitud:
 *                       type: number
 *                       example: -34.6037
 *                     longitud:
 *                       type: number
 *                       example: -58.3816
 *                     capacidad:
 *                       type: integer
 *                       example: 50
 *                     importe:
 *                       type: number
 *                       example: 5000
 *       404:
 *         description: Salón no encontrado
 */

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crea un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Salón Principal"
 *               direccion:
 *                 type: string
 *                 example: "Calle Falsa 123"
 *               latitud:
 *                 type: number
 *                 example: -34.6037
 *               longitud:
 *                 type: number
 *                 example: -58.3816
 *               capacidad:
 *                 type: integer
 *                 example: 50
 *               importe:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Salón creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /salones/{id}:
 *   put:
 *     summary: Edita un salón existente
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Salón no encontrado
 */

/**
 * @swagger
 * /salones/{id}:
 *   delete:
 *     summary: Elimina un salón
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del salón a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salón eliminado correctamente
 *       404:
 *         description: Salón no encontrado
 */

router.get("/", verificarToken, autorizarUsuarios([1, 2, 3]), cache("5 minutes"), salonesController.buscarTodos);
router.get("/:id", verificarToken, autorizarUsuarios([1, 2, 3]), salonesController.buscarPorId);

router.post(
  "/",
  verificarToken,
  autorizarUsuarios([1, 2]),
  auditarAccion("Crear Salón"),
  [
    check("titulo", "El título es obligatorio.").notEmpty(),
    check("direccion", "La dirección es obligatoria.").notEmpty(),
    check("latitud", "La latitud es obligatoria y debe ser un número.").notEmpty().isFloat(),
    check("longitud", "La longitud es obligatoria y debe ser un número.").notEmpty().isFloat(),
    check("capacidad", "La capacidad es obligatoria y debe ser un entero positivo.").notEmpty().isInt({ min: 1 }),
    check("importe", "El importe es obligatorio y debe ser numérico.").notEmpty().isFloat(),
    validarCampos,
  ],
  async (req, res, next) => {
    await salonesController.crear(req, res, next);
    // cacheClear("/api/v1/salones");
    apicache.clear("/api/v1/salones");
  }
);

router.put(
  "/:id",
  verificarToken,
  autorizarUsuarios([1, 2]),
  auditarAccion("Modificar Salón"),
  [
    check("titulo").optional().notEmpty().withMessage("El título no puede estar vacío."),
    check("direccion").optional().notEmpty().withMessage("La dirección no puede estar vacía."),
    check("latitud").optional().isFloat().withMessage("La latitud debe ser un número."),
    check("longitud").optional().isFloat().withMessage("La longitud debe ser un número."),
    check("capacidad").optional().isInt({ min: 1 }).withMessage("La capacidad debe ser un entero positivo."),
    check("importe").optional().isFloat().withMessage("El importe debe ser numérico."),
    validarCampos,
  ],
  async (req, res, next) => {
    await salonesController.editar(req, res, next);
    // cacheClear("/api/v1/salones");
    apicache.clear("/api/v1/salones");
  }
);

router.delete(
  "/:id",
  verificarToken,
  autorizarUsuarios([1, 2]),
  auditarAccion("Eliminar Salón"),
  async (req, res, next) => {
    await salonesController.eliminar(req, res, next);
    // cacheClear("/api/v1/salones");
    apicache.clear("/api/v1/salones");
  }
);

export default router;
