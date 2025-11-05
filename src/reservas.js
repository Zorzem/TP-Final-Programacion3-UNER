import { errorResponse } from "./utils/apiResponse.js";
import authRoutes from "./v1/routes/authRoutes.js";
import express from "express";
import turnosRoutes from "./v1/routes/turnosRoutes.js";
import salonesRoutes from "./v1/routes/salonesRoutes.js";
import reservasRoutes from "./v1/routes/reservasRoutes.js";
import serviciosRoutes from "./v1/routes/serviciosRoutes.js";
import usuariosRoutes from "./v1/routes/usuariosRoutes.js";
// PASSPORT 
import passport from 'passport';
// MORGAN
import morgan from 'morgan';
import fs from 'fs';
//
import {estrategia, validacion} from './config/passport.js';
import encuestasRoutes from "./v1/routes/encuestasRoutes.js";
import reportesRoutes from "./v1/routes/reportesRoutes.js";

process.loadEnvFile();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURACION PASSPORT
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());



// Token personalizado para Morgan con zona hora de Argentina
morgan.token('fecha-argentina', () => {
  const ahora = new Date();
  
  const partes = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(ahora);
  
  const valores = {};
  partes.forEach(({ type, value }) => {
    valores[type] = value;
  });
  
  return `${valores.day}/${valores.month}/${valores.year} ${valores.hour}:${valores.minute}:${valores.second}`;
});

// Formato personalizado para log
const formatoPersonalizado = ':fecha-argentina | :method | :url | :status | :response-time ms | :res[content-length]';


// morgan
let log = fs.createWriteStream('./access.log', { flags: 'a' })
app.use(morgan(formatoPersonalizado)); // log en consola
app.use(morgan(formatoPersonalizado, { stream: log })); //log en el archivo



// rutas
app.use('/api/v1/auth', authRoutes); // AUTENTICACIÓN
app.use("/api/v1/servicios", serviciosRoutes);
app.use("/api/v1/salones", salonesRoutes);
app.use("/api/v1/turnos", turnosRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/encuestas", encuestasRoutes);
app.use("/api/v1/reportes", reportesRoutes);



// AHORA LA RUTA REQUIERE DE AUTENTICACIÓN
app.use('/api/v1/reservas', passport.authenticate( 'jwt', { session:false }), reservasRoutes);

// para manejar rutas inválidas
app.use((req, res, next) => {
  return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, 404);
});

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
