import { conexion } from "./conexion.js";

export default class Usuarios {
  buscarTodos = async () => {
    const [rows] = await conexion.execute("SELECT * FROM usuarios");
    return rows;
  };

  buscarPorId = async (id) => {
    const [rows] = await conexion.execute("SELECT * FROM usuarios WHERE usuario_id = ?", [id]);
    return rows[0] ?? null;
  };

  crear = async ({ nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto }) => {
    // forzar null si no se envia nada, sino da error xd
    celular = celular ?? null;
    foto = foto ?? null;

    const [result] = await conexion.execute(
      `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, creado, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 1)`,
      [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto]
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
