// src/services/salonesService.js

import Salones from "../db/salones.js";

export default class SalonesService {
  constructor() {
    this.salones = new Salones();
  }

  buscarTodos = (incluirInactivos = false) => {
    return this.salones.buscarTodos(incluirInactivos);
  };

  crear = (datos) => {
    return this.salones.crear(datos);
  };

  buscarPorId = async (id) => {
    return this.salones.buscarPorId(id);
  };

  editar = async (id, datos) => {
    return this.salones.editar(id, datos);
  };

  eliminar = (id) => {
    return this.salones.eliminar(id);
  };
}
