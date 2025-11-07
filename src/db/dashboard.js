// src/db/dashboard.js

import { conexion } from "./conexion.js";

export const contarUsuarios = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM usuarios");
  return rows[0].total;
};

export const contarReservas = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM reservas");
  return rows[0].total;
};

export const contarEncuestas = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM encuestas");
  return rows[0].total;
};

export const contarTurnos = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM turnos");
  return rows[0].total;
};

export const contarServicios = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM servicios");
  return rows[0].total;
};

export const contarSalones = async () => {
  const [rows] = await conexion.query("SELECT COUNT(*) AS total FROM salones");
  return rows[0].total;
};
