import express from "express";

// Inicializa Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Cargar variables de entorno
process.loadEnvFile();

// Escucha en el puerto definido
app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
})