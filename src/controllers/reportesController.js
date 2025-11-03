import { successResponse, errorResponse } from "../utils/apiResponse.js";
import ReportesService from "../services/reportesService.js";

export default class ReportesController {
  constructor() {
    this.reportesService = new ReportesService();
  }

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
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período (YYYY-MM-DD)
   *       - in: query
   *         name: formato
   *         schema:
   *           type: string
   *           enum: [pdf, csv]
   *         description: Formato del reporte (pdf o csv)
   *       - in: query
   *         name: tipo
   *         schema:
   *           type: string
   *           enum: [stats, por_salon, por_fecha]
   *         description: Tipo de reporte
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *       500:
   *         description: Error al generar el reporte
   */
  getReportes = async (req, res) => {
    try {
      const { fechaInicio, fechaFin, formato = "pdf", tipo = "stats" } =
        req.query;

      const filtros = {
        fechaInicio,
        fechaFin,
        tipo,
      };

      const contenido = await this.reportesService.generarReporte(
        filtros,
        formato
      );

      if (formato === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="reporte_reservas_${fechaInicio || "all"}_${fechaFin || "all"}.csv"`
        );
        return res.send(contenido);
      }

      res.setHeader("Content-Type", "text/html");
      return res.send(contenido);
    } catch (error) {
      console.log("Error en GET /reportes", error);
      return errorResponse(res, "Error al generar el reporte", 500);
    }
  };
}

