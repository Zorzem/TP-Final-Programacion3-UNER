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

import { estrategia, validacion} from './config/passport.js';
// LUXON para zona horaria
import { DateTime } from 'luxon';



process.loadEnvFile();

const app = express();

app.use(express.json());

// CONFIGURACION PASSPORT
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());



// Token personalizado para Morgan con hora de Argentina
morgan.token('fecha-argentina', () => {
  return DateTime.now()
    .setZone('America/Argentina/Buenos_Aires')
    .toFormat('dd/MM/yyyy HH:mm:ss');
});

// Formato personalizado de Morgan
const formatoPersonalizado = ':fecha-argentina | :method | :url | :status | :response-time ms | :res[content-length]';

// morgan
let log = fs.createWriteStream('./access.log', { flags: 'a' })
app.use(morgan(formatoPersonalizado)); // en consola
app.use(morgan(formatoPersonalizado, { stream: log })); // en el archivo



// rutas
app.use('/api/v1/auth', authRoutes); // AUTENTICACIÓN
app.use("/api/v1/servicios", serviciosRoutes);
app.use("/api/v1/salones", salonesRoutes);
app.use("/api/v1/turnos", turnosRoutes);
app.use("/api/v1/reservas", reservasRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);


// AHORA LA RUTA REQUIERE DE AUTENTICACIÓN
app.use('/api/v1/reservas', passport.authenticate( 'jwt', { session:false }), reservasRoutes);

// para manejar rutas inválidas
app.use((req, res, next) => {
  return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, 404);
});

app.listen(process.env.PUERTO, () => {
  console.log(`Servidor arriba en el puerto ${process.env.PUERTO}`);
});
