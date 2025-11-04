import { conexion } from "./conexion.js";
import crypto from 'crypto';



export default class Usuarios {

  buscar = async (nombre_usuario, contrasenia) => {
      const sql = `SELECT u.usuario_id, CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario
                      FROM usuarios  AS u
                      WHERE u.nombre_usuario = ? 
                          AND u.contrasenia = SHA2(?, 256) 
                          AND u.activo = 1;`
      const [result] = await conexion.query(sql, [nombre_usuario, contrasenia]);
      return result[0];
  }


  buscarPorId = async (usuario_id) => {
      const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id
                        FROM usuarios  AS u
                        WHERE u.usuario_id = ? AND u.activo = 1;`
      const [result] = await conexion.query(sql, [usuario_id]);
      return result[0];
  }


  buscarTodos = async () => {
    const [rows] = await conexion.execute("SELECT * FROM usuarios");
    return rows;
  };
/* 
  buscarPorId = async (id) => {
    const [rows] = await conexion.execute("SELECT * FROM usuarios WHERE usuario_id = ?", [id]);
    return rows[0] ?? null;
  }; */

crear = async ({ nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
  // forzar null si no se envia nada
  celular = celular ?? null;
  foto = foto ?? null;

  // Hashear la contraseña con SHA-256
  //const hashContrasenia = crypto.createHash('sha256').update(contrasenia).digest('hex');

  const [result] = await conexion.execute(
    `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, creado, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 1)`,
    [nombre, apellido, nombre_usuario, tipo_usuario, celular, foto]
  );
  return result.insertId;
};

  editar = async (id, datos) => {
    // null para campos opcionales si vienen como undefined
    if (datos.celular === undefined) datos.celular = null;
    if (datos.foto === undefined) datos.foto = null;

    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const sets = campos.map((c) => `${c} = ?`).join(", ");

    const [result] = await conexion.execute(`UPDATE usuarios SET ${sets}, modificado = NOW() WHERE usuario_id = ?`, [
      ...valores,
      id,
    ]);
    return result.affectedRows;
  };

  eliminar = async (id) => {
    const [result] = await conexion.execute(`DELETE FROM usuarios WHERE usuario_id = ?`, [id]);
    return result;
  };
}
