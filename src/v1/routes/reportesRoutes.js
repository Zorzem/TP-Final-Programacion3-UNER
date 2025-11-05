// src/v1/routes/reportesRoutes.js

import express from "express";
import ReportesController from "../../controllers/reportesController.js";

const reportesController = new ReportesController();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes de reservas
 */

/**
 * @swagger
 * /api/v1/reportes:
 *   get:
 *     summary: Genera reportes de reservas en formato PDF o CSV
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *         example: "2025-11-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
 *         example: "2025-11-05"
 *       - in: query
 *         name: formato
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *           default: pdf
 *         description: Formato del reporte
 *         example: pdf
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [stats, por_salon, por_fecha]
 *           default: stats
 *         description: Tipo de reporte
 *         example: stats
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al generar el reporte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   example: "Error al generar el reporte"
 */

router.get("/", reportesController.getReportes);

export default router;
