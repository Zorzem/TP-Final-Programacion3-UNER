// src/services/notificacionesService.js

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

export default class NotificacionesService {
  enviarCorreo = async (datosCorreo) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const plantillaPath = path.join(__dirname, "../utils/handlebars/plantilla.hbs");
    const plantilla = fs.readFileSync(plantillaPath, "utf-8");

    const template = handlebars.compile(plantilla);

    const datos = {
      fecha: datosCorreo[0].map((a) => a.fecha),
      salon: datosCorreo[0].map((a) => a.salon),
      turno: datosCorreo[0].map((a) => a.turno),
    };

    const correoHtml = template(datos);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USERCORREO,
        pass: process.env.PASSCORREO,
      },
    });

    // CORREOS DE LOS ADMINISTRADORES
    const correosAdmin = datosCorreo[1].map((a) => a.correoAdmin);
     // SEPARO POR COMA PARA AGREGAR A LAS OPCIONES DEL ENVIO
    const destinatarios = correosAdmin.join(", ");

    const mailOptions = {
      from: process.env.CORREO,
      to: destinatarios,
      // cc: clientes/admin COMPLETAR TAREA
      subject: "Nueva Reserva",
      html: correoHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error enviado el correo`, error);
        return false;
      }
      console.log(`Correo enviado correctamente a: ${destinatarios}`);
      return true;
    });
  };

  // OTROS TIPOS DE NOTIFICACION
  enviarMensaje = async (datos) => {
    console.log("Envio mensaje:", datos);
    return true;
  };

  enviarWhatsapp = async (datos) => {
    console.log("Envio WhatsApp:", datos);
    return true;};

  enviarNotificacionPush = async (datos) => {
    console.log("Envio notificación push:", datos);
    return true;};
}
