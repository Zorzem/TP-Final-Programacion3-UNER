// src/v1/routes/reservasRoutes.js

import express from "express";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import ReservasController from "../../controllers/reservasController.js";
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads/cumpleanieros');

// Crear carpeta uploads/cumpleanieros si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const reservasController = new ReservasController();
const router = express.Router();

// Configuración de Multer para subir foto del cumpleañero
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cumple_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });


/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gestión de reservas de salones
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas encontradas
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
 *                       fecha_reserva:
 *                         type: string
 *                         example: "2025-11-05"
 *                       salon_id:
 *                         type: integer
 *                         example: 3
 *                       usuario_id:
 *                         type: integer
 *                         example: 12
 *                       turno_id:
 *                         type: integer
 *                         example: 2
 *                       tematica:
 *                         type: string
 *                         example: "Princesas"
 *                       importe_salon:
 *                         type: number
 *                         example: 5000
 *                       foto_cumpleaniero:
 *                         type: string
 *                         example: "cumple_1699152000000.jpg"
 */

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva encontrada
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
 *                     fecha_reserva:
 *                       type: string
 *                       example: "2025-11-05"
 *                     salon_id:
 *                       type: integer
 *                       example: 3
 *                     usuario_id:
 *                       type: integer
 *                       example: 12
 *                     turno_id:
 *                       type: integer
 *                       example: 2
 *                     tematica:
 *                       type: string
 *                       example: "Princesas"
 *                     importe_salon:
 *                       type: number
 *                       example: 5000
 *                     foto_cumpleaniero:
 *                       type: string
 *                       example: "cumple_1699152000000.jpg"
 *                     servicios:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Reserva no encontrada
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - usuario_id
 *               - turno_id
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 description: Fecha de la reserva (YYYY-MM-DD)
 *                 example: "2025-11-05"
 *               salon_id:
 *                 type: integer
 *                 example: 3
 *               usuario_id:
 *                 type: integer
 *                 example: 12
 *               turno_id:
 *                 type: integer
 *                 example: 2
 *               tematica:
 *                 type: string
 *                 example: "Princesas"
 *               importe_salon:
 *                 type: number
 *                 example: 5000
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de servicios adicionales
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: Foto del cumpleañero
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Edita una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a editar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 example: "2025-11-06"
 *               salon_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               tematica:
 *                 type: string
 *               importe_salon:
 *                 type: number
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: integer
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 */

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 */


router.get('/:reserva_id',  autorizarUsuarios([1,2,3]), reservasController.buscarPorId);

router.get('/',  autorizarUsuarios([1,2,3]), reservasController.buscarTodos);

router.post('/', autorizarUsuarios([1,3]),upload.single("foto_cumpleaniero"),
    [
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
        check('salon_id', 'El salón es necesario.').notEmpty(),
        check('usuario_id', 'El usuario es necesario.').notEmpty(), 
        check('turno_id', 'El turno es necesario.').notEmpty(),  
        check('servicios', 'Faltan los servicios de la reserva.')
        .notEmpty()
        .isArray(),
        check('servicios.*.importe')
        .isFloat() 
        .withMessage('El importe debe ser numérico.'),   
        validarCampos
    ],
    reservasController.crear);


router.put("/:id",  autorizarUsuarios([1]), upload.single("foto_cumpleaniero"), reservasController.editar);
router.delete("/:id", autorizarUsuarios([1]), reservasController.eliminar);


export default router;
