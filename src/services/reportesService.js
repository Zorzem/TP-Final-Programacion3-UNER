// src/services/reportesService.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import Reportes from "../db/reportes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

handlebars.registerHelper("eq", (a, b) => a === b);
handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));

export default class ReportesService {
  constructor() {
    this.reportes = new Reportes();
  }

  // Genera reporte (solo CSV o HTML)
  generarReporte = async (filtros, formato) => {
    const datos = await this.reportes.getReporteReservas(filtros);

    // Si no hay datos, devolver mensaje
    if (!datos || datos.length === 0) {
      return Buffer.from("No hay datos disponibles\n", "utf-8");
    }

    // Solo dos opciones: CSV o HTML (manteniendo lo original)
    if (formato === "csv") {
      return this.generarCSV(datos, filtros);
    }

    return this.generarHTML(datos, filtros);
  };

  generarCSV = (datos, filtros) => {
    const headers = Object.keys(datos[0]).join(",");
    const rows = datos.map((row) =>
      Object.values(row)
        .map((val) => `"${val ?? ""}"`)
        .join(",")
    );
  
    const csv = [headers, ...rows].join("\n");
    return Buffer.from(csv, "utf-8");
  };

  generarHTML = (datos, filtros) => {
    const plantillaPath = path.join(__dirname, "../utils/handlebars/reporte.hbs");
    let template;

    try {
      const contenido = fs.readFileSync(plantillaPath, "utf-8");
      template = handlebars.compile(contenido);
    } catch (error) {
      template = handlebars.compile(`
        <html>
          <head><title>Reporte de Reservas</title></head>
          <body>
            <h1>Reporte de Reservas</h1>
            <p>Periodo: {{fechaInicio}} - {{fechaFin}}</p>
            <pre>{{json datos}}</pre>
          </body>
        </html>
      `);
    }

    const html = template({
      datos,
      fechaInicio: filtros.fechaInicio || "N/A",
      fechaFin: filtros.fechaFin || "N/A",
      tipo: filtros.tipo || "stats",
    });

    return Buffer.from(html, "utf-8");
  };
}
