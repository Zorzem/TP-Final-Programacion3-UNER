import Servicios from "../db/servicios.js";

export default class ServiciosService {
  constructor() {
    this.servicios = new Servicios();
  }

  buscarTodos = (incluirInactivos = false) => {
    return this.servicios.buscarTodos(incluirInactivos);
  };

  crear = (descripcion, importe) => {
    return this.servicios.crear(descripcion, importe);
  };

  buscarPorId = async (id) => {
    return this.servicios.buscarPorId(id);
  };

  editar = async (id, datos) => {
    return this.servicios.editar(id, datos);
  };
  eliminar = (id) => {
    return this.servicios.eliminar(id);
  };
}
