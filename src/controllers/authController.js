// src/controllers/authController.js

import jwt from "jsonwebtoken";
import passport from "passport";
import fs from "fs";
import path from "path";

//ruta del archivo de logs dentro de src/logs/
const LOG_PATH = path.join(process.cwd(), "logs", "auditoria.log");

export default class AuthController {
  login = async (req, res) => {
    //console.log("--- CONTROLLER LOGIN REQUEST BODY AUTORIZACION  ---", req.body);

    passport.authenticate("local", { session: false }, (err, usuario, info) => {
      //console.log("passport callback -> err:", err, "usuario:", usuario ? true : usuario, "info:", info);
      if (err || !usuario) {
        //Si falla, registro el intento en el log de auditoría
        const fechaHora = new Date().toLocaleString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour12: false, // evita AM/PM
        });
        const log = `[AUDITORÍA] ${fechaHora} | Intento fallido de login | Usuario: ${req.body.nombre_usuario} | IP: ${req.ip}\n`;
        //abro el archivo en modo append y escribo el log
        fs.appendFileSync(LOG_PATH, log, "utf8");
        
        return res.status(400).json({
          estado: false,
          mensaje: "Solicitud incorrecta.",
          //error: err,
          //usuario: usuario,
          //info: info,
        });
      }

      // ARMO EL TOKEN Y ENVIO CLIENTE
      req.login(usuario, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        // ARMAMOS EL TOKEN CON LOS DATOS DEL USUARIO Y UNA EXPIRACION
        const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: "1h" });

        //Si accede Registramos el login exitoso en el log
        const fechaHora = new Date().toLocaleString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour12: false, // formato 24h
        });
        const log = `[AUDITORÍA] ${fechaHora} | Usuario: ${req.body.nombre_usuario} | (Usuario ID: ${usuario.usuario_id}) | Acción: Login exitoso | IP: ${req.ip}\n`;
        fs.appendFileSync(LOG_PATH, log, "utf8");


        return res.json({
          estado: true,
          token: token,
        });
      });
    })(req, res);
  };
}
