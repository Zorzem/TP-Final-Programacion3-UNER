import ServiciosService from "../services/serviciosService.js";

export default class ServiciosController {
  constructor() {
    this.serviciosService = new ServiciosService();
  }

  buscarTodos = async (req, res) => {
    try {
      const servicios = await this.serviciosService.buscarTodos();

      res.json({ estado: true, datos: servicios });
    } catch (error) {
      console.log("Error en GET /servicios", error);
      res.status(500).json({
        estado: false,
        mensaje: `Error interno del servidor`,
      });
    }
  };
}
