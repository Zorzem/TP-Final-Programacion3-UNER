// src/servidor.js

import app from "./reservas.js";

process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
  // console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
  console.log("\x1b[32m%s\x1b[0m", `Servidor arriba en el puerto ${process.env.PUERTO}`);
  console.log("\x1b[32m%s\x1b[0m", `Documentación: http://localhost:${process.env.PUERTO}/api-docs`);
  console.log("\x1b[32m%s\x1b[0m", `Dashboard: http://localhost:${process.env.PUERTO}/dashboard`);
  console.log();
});
