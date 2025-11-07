// src/middlewares/auditarAccion.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..", "..");

export default function auditarAccion(recurso) {
  return (req, res, next) => {
    const usuario = req.user;// se obtiene el usuario autenticado
    if (!usuario) return next();

    const usuarioId = usuario.usuario_id;
    const nombreUsuario = usuario.usuario;
    //Captura información sobre la petición HTTP
    const metodo = req.method;
    const url = req.originalUrl;
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || "IP desconocida";

    const fechaHora = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });


    //  Crear el mensaje de auditoría
    const mensajeAuditoria = `[AUDITORÍA] ${fechaHora} | Usuario: ${nombreUsuario} | Usuario ID: ${usuarioId} | ${metodo} ${url} | Recurso: ${recurso} | IP: ${ip}\n`;

    console.log(mensajeAuditoria.trim());

    // Guardar en archivo
    try {
      const logsDir = path.join(projectRoot, "logs");
      const logFile = path.join(logsDir, "auditoria.log");

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        console.log(`Directorio de logs creado: ${logsDir}`);
      }

      fs.appendFileSync(logFile, mensajeAuditoria, "utf8");
    } catch (err) {
      console.error("Error escribiendo log de auditoría:", err);
    }
  

    next();
  };
}