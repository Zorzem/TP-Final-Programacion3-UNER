// src/services/encuestasService.js

import Encuestas from "../db/encuestas.js";

export default class EncuestasService {
  constructor() {
    this.encuestas = new Encuestas();
  }

  buscarTodos = (incluirInactivos = false) => {
    return this.encuestas.buscarTodos(incluirInactivos);
  };

  buscarPorUsuario = (usuarioId, incluirInactivos = false) => {
    return this.encuestas.buscarPorUsuario(usuarioId, incluirInactivos);
  };

  buscarPorSalon = (salonId, incluirInactivos = false) => {
    return this.encuestas.buscarPorSalon(salonId, incluirInactivos);
  };

  buscarPorId = async (id) => {
    return this.encuestas.buscarPorId(id);
  };

  crear = (datos) => {
    return this.encuestas.crear(datos);
  };

  editar = async (id, datos) => {
    return this.encuestas.editar(id, datos);
  };

  eliminar = (id) => {
    return this.encuestas.eliminar(id);
  };
}
