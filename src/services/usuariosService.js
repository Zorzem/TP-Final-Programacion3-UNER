import Usuarios from "../db/usuarios.js";

export default class UsuariosService {
  constructor() {
    this.usuarios = new Usuarios();
  }

  buscar = (nombre_usuario, contrasenia) => {return this.usuarios.buscar(nombre_usuario, contrasenia);}
  buscarTodos = () => this.usuarios.buscarTodos();
  buscarPorId = (id) => this.usuarios.buscarPorId(id);
  crear = (datos) => this.usuarios.crear(datos);
  editar = (id, datos) => this.usuarios.editar(id, datos);
  eliminar = (id) => this.usuarios.eliminar(id);



}
