// testNotificaciones.js

import NotificacionesService from "../src/services/notificacionesService.js";

const notificaciones = new NotificacionesService();

console.log("=== PRUEBA DE MÉTODOS DE NOTIFICACIÓN ===");

await notificaciones.enviarMensaje({
  usuario: "José",
  mensaje: "Prueba genérica de mensaje",
});

await notificaciones.enviarWhatsapp({
  numero: "3412345678",
  texto: "Mensaje de prueba por WhatsApp",
});

await notificaciones.enviarNotificacionPush({
  usuarioId: 1,
  titulo: "Reserva confirmada",
  cuerpo: "Reserva registrada correctamente.",
});

/**
 * CÓMO EJECUTAR:
 *   Desde la raíz del proyecto, ejecutar `node test/testNotificaciones.js`
 */
