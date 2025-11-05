// src/controllers/salonesController.js

import { successResponse, errorResponse, notFoundResponse } from "../utils/apiResponse.js";
import SalonesService from "../services/salonesService.js";

export default class SalonesController {
  constructor() {
    this.salonesService = new SalonesService();
  }

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
