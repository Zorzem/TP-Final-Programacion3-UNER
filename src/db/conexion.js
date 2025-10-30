import mysql from "mysql2/promise";
process.loadEnvFile();

// usando createPool para soportar varias conexiones concurrentes
export const conexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
