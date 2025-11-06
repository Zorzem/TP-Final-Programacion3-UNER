// src/services/reservasService.js
import Reservas from "../db/reservas.js";
import Salones from "../db/salones.js";
import Usuarios from "../db/usuarios.js";
import Turnos from "../db/turnos.js";
import NotificacionesService from "./notificacionesService.js";

export default class ReservasService {
  constructor() {
    this.reservas = new Reservas();
    this.salones = new Salones();
    this.usuarios = new Usuarios();
    this.turnos = new Turnos();
    this.notificacionesService = new NotificacionesService();
  }

  buscarTodos = (usuario) => {
    if (usuario.tipo_usuario < 3) {
      return this.reservas.buscarTodos();
    } else {
      return this.reservas.buscarPropias(usuario.usuario_id);
    }
  };

  buscarPorId = async (id) => {
    return this.reservas.buscarPorId(id);
  };

  crear = async (datos) => {
    const { salon_id, usuario_id, turno_id } = datos;

    const salonExiste = await this.salones.existeSalon(salon_id);
    if (!salonExiste) throw new Error(`El salón con ID ${salon_id} no existe`);

    const usuarioExiste = await this.usuarios.existeUsuario(usuario_id);
    if (!usuarioExiste) throw new Error(`El usuario con ID ${usuario_id} no existe`);

    const turnoExiste = await this.turnos.existeTurno(turno_id);
    if (!turnoExiste) throw new Error(`El turno con ID ${turno_id} no existe`);

    return this.reservas.crear(datos);
  };

  editar = async (id, datos) => {
    return this.reservas.editar(id, datos);
  };

  eliminar = (id) => {
    return this.reservas.eliminar(id);
  };

  obtenerServicios = (reserva_id) => {
    return this.reservas.obtenerServiciosDeReserva(reserva_id);
  };
}
