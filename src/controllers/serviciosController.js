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

  buscarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await this.serviciosService.buscarPorId(id);

      if (!servicio) {
        return res.status(404).json({
          estado: false,
          mensaje: "Servicio no encontrado",
        });
      }

      res.json({ estado: true, datos: servicio });
    } catch (error) {
      console.log(`Error en GET /servicios/${req.params.id}`, error);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor",
      });
    }
  };
  
  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const { descripcion, importe, activo } = req.body;

      const actualizado = await this.serviciosService.editar(id, {
        descripcion,
        importe,
        activo,
      });

      if (!actualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Servicio no encontrado",
        });
      }

      res.json({
        estado: true,
        mensaje: "Servicio actualizado correctamente",
      });
    } catch (error) {
      console.log(`Error en PUT /servicios/${req.params.id}`, error);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor",
      });
    }
  };
}
