import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import UsuariosService from "../services/usuariosService.js";

export default class UsuariosController {
  constructor() {
    this.usuariosService = new UsuariosService();
  }

  /**
   * @swagger
   * /api/v1/usuarios:
   *   get:
   *     summary: Obtiene la lista de todos los usuarios.
   *     tags: [Usuarios]
   *     security:
   *       - jwtAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios.
   *       500:
   *         description: Error interno del servidor.
   */
  buscarTodos = async (req, res) => {
    try {
      const usuarios = await this.usuariosService.buscarTodos();
      return successResponse(res, usuarios, "Usuarios encontrados");
    } catch (error) {
      console.log("Error en GET /usuarios", error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/usuarios/{id}:
   *   get:
   *     summary: Obtiene un usuario por ID.
   *     tags: [Usuarios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario encontrado.
   *       404:
   *         description: Usuario no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuariosService.buscarPorId(id);
      if (!usuario) return notFoundResponse(res, `Usuario con ID ${id} no encontrado`);
      return successResponse(res, usuario, "Usuario encontrado");
    } catch (error) {
      console.log(`Error en GET /usuarios/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/usuarios:
   *   post:
   *     summary: Crea un nuevo usuario.
   *     tags: [Usuarios]
   *     security:
   *       - jwtAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UsuarioCreate'
   *     responses:
   *       201:
   *         description: Usuario creado con éxito.
   *       400:
   *         description: Faltan datos obligatorios o error de validación.
   *       500:
   *         description: Error interno del servidor.
   */
  crear = async (req, res) => {
    try {
      const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push("nombre");
      if (!apellido) faltantes.push("apellido");
      if (!nombre_usuario) faltantes.push("nombre_usuario");
      if (!contrasenia) faltantes.push("contrasenia");
      if (!tipo_usuario) faltantes.push("tipo_usuario");

      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      // Validaciones de tipo
      if (typeof nombre !== "string" || nombre.trim() === "")
        return errorResponse(res, "El campo 'nombre' debe ser un texto válido", 400);

      if (typeof apellido !== "string" || apellido.trim() === "")
        return errorResponse(res, "El campo 'apellido' debe ser un texto válido", 400);

      if (typeof nombre_usuario !== "string" || nombre_usuario.trim() === "")
        return errorResponse(res, "El campo 'nombre_usuario' debe ser un texto válido", 400);

      if (typeof contrasenia !== "string" || contrasenia.trim() === "")
        return errorResponse(res, "El campo 'contrasenia' debe ser un texto válido", 400);

      if (typeof tipo_usuario !== "number" || isNaN(tipo_usuario))
        return errorResponse(res, "El campo 'tipo_usuario' debe ser numérico", 400);

      const nuevoId = await this.usuariosService.crear({
        nombre,
        apellido,
        nombre_usuario,
        contrasenia,
        tipo_usuario,
        celular,
        foto,
      });
      return successResponse(res, { id: nuevoId }, "Usuario creado con éxito", 201);
    } catch (error) {
      console.log("Error en POST /usuarios", error);

      // if (error.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
      //   return errorResponse(
      //     res,
      //     `error de BD: uno o más campos tienen un valor incompatible: ${error.sqlMessage}`,
      //     400
      //   );
      // }

      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/usuarios/{id}:
   *   put:
   *     summary: Actualiza un usuario existente.
   *     tags: [Usuarios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UsuarioUpdate'
   *     responses:
   *       200:
   *         description: Usuario actualizado correctamente.
   *       400:
   *         description: Error en la validación de datos.
   *       404:
   *         description: Usuario no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const camposValidos = [
        "nombre",
        "apellido",
        "nombre_usuario",
        "contrasenia",
        "tipo_usuario",
        "celular",
        "foto",
        "activo",
      ];
      const camposRecibidos = Object.keys(req.body);

      if (camposRecibidos.length === 0) {
        return errorResponse(res, "No se enviaron campos para actualizar", 400);
      }

      const invalidos = camposRecibidos.filter((campo) => !camposValidos.includes(campo));
      if (invalidos.length > 0) {
        return errorResponse(
          res,
          `Campos inválidos: ${invalidos.join(", ")}. Campos permitidos: ${camposValidos.join(", ")}`,
          400
        );
      }

      const actualizado = await this.usuariosService.editar(id, req.body);
      if (!actualizado) return notFoundResponse(res, `Usuario con ID ${id} no encontrado`);

      return successResponse(res, null, `Usuario con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.log(`Error en PUT /usuarios/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/usuarios/{id}:
   *   delete:
   *     summary: Elimina un usuario (eliminación lógica).
   *     tags: [Usuarios]
   *     security:
   *       - jwtAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario eliminado correctamente.
   *       404:
   *         description: Usuario no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.usuariosService.eliminar(id);
      if (!resultado || resultado.affectedRows === 0)
        return notFoundResponse(res, `Usuario con ID ${id} no encontrado`);
      return successResponse(res, null, `Usuario con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log(`Error en DELETE /usuarios/${req.params.id}`, error);
      return errorResponse(res);
    }
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *         tipo_usuario:
 *           type: integer
 *         celular:
 *           type: string
 *         foto:
 *           type: string
 *         activo:
 *           type: boolean
 *         creado:
 *           type: string
 *           format: date-time
 *         modificado:
 *           type: string
 *           format: date-time
 *     UsuarioCreate:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *         - contrasenia
 *         - tipo_usuario
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *         contrasenia:
 *           type: string
 *         tipo_usuario:
 *           type: integer
 *         celular:
 *           type: string
 *         foto:
 *           type: string
 *     UsuarioUpdate:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *         contrasenia:
 *           type: string
 *         tipo_usuario:
 *           type: integer
 *         celular:
 *           type: string
 *         foto:
 *           type: string
 *         activo:
 *           type: boolean
 */
