import mysql from 'mysql2/promise';
process.loadEnvFile()

export const conexion = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD,
});