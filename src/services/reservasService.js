import { conexion } from "../db/conexion.js";
import Reservas from "../db/reservas.js";
import NotificacionesService from "./notificacionesService.js";

export default class ReservasService {
  constructor() {
    this.reservas = new Reservas();
    //this.reservas_servicios = new ReservasServicios();
    this.notificacionesService = new NotificacionesService();
  }

/*   buscarTodos = (incluirInactivos = false) => {
    return this.reservas.buscarTodos(incluirInactivos);
  }; */
  
  buscarTodos = (usuario) => {

      if(usuario.tipo_usuario < 3){
          return this.reservas.buscarTodos();
      }else{
          return this.reservas.buscarPropias(usuario.usuario_id);
      }

  }



  buscarPorId = async (id) => {
    return this.reservas.buscarPorId(id);
  };

  crear = async (datos) => {
    const { salon_id, usuario_id, turno_id } = datos;

    // validar existencia de claves foráneas antes de crear la reserva
    const [salonExiste] = await conexion.execute("SELECT 1 FROM salones WHERE salon_id = ?", [salon_id]);
    if (salonExiste.length === 0) {
      console.log(`El salón con ID ${salon_id} no existe`);
      throw new Error(`El salón con ID ${salon_id} no existe`);
    }

    const [usuarioExiste] = await conexion.execute("SELECT 1 FROM usuarios WHERE usuario_id = ?", [usuario_id]);
    if (usuarioExiste.length === 0) {
      console.log(`El usuario con ID ${usuario_id} no existe`);
      throw new Error(`El usuario con ID ${usuario_id} no existe`);
    }

    const [turnoExiste] = await conexion.execute("SELECT 1 FROM turnos WHERE turno_id = ?", [turno_id]);
    if (turnoExiste.length === 0) {
      console.log(`El turno con ID ${turno_id} no existe`);
      throw new Error(`El turno con ID ${turno_id} no existe`);
    }

    // Si todo existe, proceder a crear la reserva
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
