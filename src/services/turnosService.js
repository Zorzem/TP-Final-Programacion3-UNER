// src/services/turnosService.js

import Turnos from "../db/turnos.js";

export default class TurnosService {
  constructor() {
    this.turnos = new Turnos();
  }

  buscarTodos = (incluirInactivos = false) => {
    return this.turnos.buscarTodos(incluirInactivos);
  };

  buscarPorId = (id) => {
    return this.turnos.buscarPorId(id);
  };

  crear = (datos) => {
    return this.turnos.crear(datos);
  };

  editar = (id, datos) => {
    return this.turnos.editar(id, datos);
  };

  eliminar = (id) => {
    return this.turnos.eliminar(id);
  };
}
