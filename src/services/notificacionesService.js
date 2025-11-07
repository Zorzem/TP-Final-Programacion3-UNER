// src/services/notificacionesService.js
import nodemailer from "nodemailer";

export default class NotificacionesService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USERCORREO,
        pass: process.env.PASSCORREO,
      },
    });
  }

  async enviarCorreoReserva({ correoUsuario, correoAdmin, datosReserva }) {
    const { fecha_reserva, tematica, importe_total, salon, hora_desde, hora_hasta } = datosReserva;

    const html = `
      <h2>🎉 ¡Reserva confirmada!</h2>
      <p><strong>Fecha:</strong> ${fecha_reserva}</p>
      <p><strong>Temática:</strong> ${tematica || "Sin temática"}</p>
      <p><strong>Salón:</strong> ${salon}</p>
      <p><strong>Horario:</strong> ${hora_desde} - ${hora_hasta}</p>
      <p><strong>Importe total:</strong> $${importe_total}</p>
    `;

    const mailOptions = {
      from: process.env.CORREO,
      to: `${correoUsuario}, ${correoAdmin}`,
      subject: "Nueva reserva confirmada 🎈",
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${correoUsuario} y ${correoAdmin}`);
    } catch (error) {
      console.error("Error al enviar correo:", error);
    }
  }
}

