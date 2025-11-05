import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import SalonesService from "../services/salonesService.js";

export default class SalonesController {
  constructor() {
    this.salonesService = new SalonesService();
  }

  /**
   * @swagger
   * /api/v1/salones:
   *   get:
   *     summary: Obtiene la lista de todos los salones.
   *     tags: [Salones]
   *     security:
   *       - jwtAuth: []
   *     responses:
   *       200:
   *         description: Lista de salones.
   *       500:
   *         description: Error interno del servidor.
   */
  buscarTodos = async (req, res) => {
    try {
      const { incluirInactivos } = req.query;
      const incluir = incluirInactivos === "true";
      const salones = await this.salonesService.buscarTodos(incluir);
      return successResponse(res, salones, "Salones encontrados");
    } catch (error) {
      console.log("Error en GET /salones", error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/salones/{id}:
   *   get:
   *     summary: Obtiene un salón por ID.
   *     tags: [Salones]
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
   *         description: Salón encontrado.
   *       404:
   *         description: Salón no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const salon = await this.salonesService.buscarPorId(id);
      if (!salon) return notFoundResponse(res, `Salón con ID ${id} no encontrado`);
      return successResponse(res, salon, "Salón encontrado");
    } catch (error) {
      console.log(`Error en GET /salones/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/salones:
   *   post:
   *     summary: Crea un nuevo salón.
   *     tags: [Salones]
   *     security:
   *       - jwtAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SalonCreate'
   *     responses:
   *       201:
   *         description: Salón creado con éxito.
   *       400:
   *         description: Faltan datos obligatorios.
   *       500:
   *         description: Error interno del servidor.
   */
  crear = async (req, res) => {
    try {
      const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

      const faltantes = [];
      if (!titulo) faltantes.push("titulo");
      if (!direccion) faltantes.push("direccion");
      if (!capacidad) faltantes.push("capacidad");
      if (!importe) faltantes.push("importe");

      if (faltantes.length > 0) {
        return errorResponse(res, `Faltan datos obligatorios: ${faltantes.join(", ")}`, 400);
      }

      const nuevoSalonId = await this.salonesService.crear({
        titulo,
        direccion,
        latitud: latitud ?? null,
        longitud: longitud ?? null,
        capacidad,
        importe,
      });

      return successResponse(res, { id: nuevoSalonId }, "Salón creado con éxito", 201);
    } catch (error) {
      console.log("Error en POST /salones", error);
      return errorResponse(res);
    }
  };

  // editar = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const actualizado = await this.salonesService.editar(id, req.body);
  //     if (!actualizado) return notFoundResponse(res, `Salón con ID ${id} no encontrado`);
  //     return successResponse(res, null, `Salón con ID ${id} actualizado correctamente`);
  //   } catch (error) {
  //     console.log(`Error en PUT /salones/${req.params.id}`, error);
  //     return errorResponse(res);
  //   }
  // };

  /**
   * @swagger
   * /api/v1/salones/{id}:
   *   put:
   *     summary: Actualiza un salón existente.
   *     tags: [Salones]
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
   *             $ref: '#/components/schemas/SalonUpdate'
   *     responses:
   *       200:
   *         description: Salón actualizado correctamente.
   *       400:
   *         description: Error en la validación de datos.
   *       404:
   *         description: Salón no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const camposValidos = ["titulo", "direccion", "latitud", "longitud", "capacidad", "importe"];
      const camposRecibidos = Object.keys(req.body);

      // si no envió nada
      if (camposRecibidos.length === 0) {
        return errorResponse(res, "No se enviaron campos para actualizar", 400);
      }

      // validar campos incorrectos
      const invalidos = camposRecibidos.filter((campo) => !camposValidos.includes(campo));
      if (invalidos.length > 0) {
        return errorResponse(
          res,
          `Campos inválidos: ${invalidos.join(", ")}. Campos permitidos: ${camposValidos.join(", ")}`,
          400
        );
      }

      // validar que importe sea un número
      const { importe } = req.body;
      if (importe !== undefined && (isNaN(importe) || typeof Number(importe) !== "number")) {
        return errorResponse(res, "El campo 'importe' debe ser numérico", 400);
      }

      const actualizado = await this.salonesService.editar(id, req.body);
      if (!actualizado) return notFoundResponse(res, `Salón con ID ${id} no encontrado`);

      return successResponse(res, null, `Salón con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.log(`Error en PUT /salones/${req.params.id}`, error);
      return errorResponse(res);
    }
  };

  /**
   * @swagger
   * /api/v1/salones/{id}:
   *   delete:
   *     summary: Elimina un salón (eliminación lógica).
   *     tags: [Salones]
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
   *         description: Salón eliminado correctamente.
   *       404:
   *         description: Salón no encontrado.
   *       500:
   *         description: Error interno del servidor.
   */
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.salonesService.eliminar(id);
      if (resultado && resultado.affectedRows === 0) return notFoundResponse(res, `Salón con ID ${id} no encontrado`);
      return successResponse(res, null, `Salón con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log("Error en DELETE /salones/:id", error);
      return errorResponse(res);
    }
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         salon_id:
 *           type: integer
 *         titulo:
 *           type: string
 *         direccion:
 *           type: string
 *         latitud:
 *           type: number
 *         longitud:
 *           type: number
 *         capacidad:
 *           type: integer
 *         importe:
 *           type: number
 *         activo:
 *           type: boolean
 *         creado:
 *           type: string
 *           format: date-time
 *         modificado:
 *           type: string
 *           format: date-time
 *     SalonCreate:
 *       type: object
 *       required:
 *         - titulo
 *         - direccion
 *         - capacidad
 *         - importe
 *       properties:
 *         titulo:
 *           type: string
 *         direccion:
 *           type: string
 *         latitud:
 *           type: number
 *         longitud:
 *           type: number
 *         capacidad:
 *           type: integer
 *         importe:
 *           type: number
 *     SalonUpdate:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *         direccion:
 *           type: string
 *         latitud:
 *           type: number
 *         longitud:
 *           type: number
 *         capacidad:
 *           type: integer
 *         importe:
 *           type: number
 */
