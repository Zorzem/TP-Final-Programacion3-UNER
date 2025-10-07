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
      const { descripcion, importe } = req.body;

      if(!descripcion ||!importe){
        return res.status(400).json({
          'estado': false,
          'mensaje':'faltan datos obligatorios'
        });
      }

      const actualizado = await this.serviciosService.editar(id, {
        descripcion,
        importe
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

  crear = async (req,res) => {
    try{
      const {descripcion,importe} =req.body;
      if(!descripcion ||!importe){
        return res.status(400).json({
          'estado': false,
          'mensaje':'faltan datos obligatorios, descripcion e importe'
        });
      }
      const nuevoServicioId=await this.serviciosService.crear(descripcion,importe);
      res.status(201).json({
        'estado':true,
        'mensaje':'servicio creado con exito',
        'id':nuevoServicioId
      });

    }
    catch(error){
      console.log("Error en POST /servicios",error);
      res.status(500).json({
        'estado':false,
        'mensaje':'error interno del servidor'
      });
    }
  }
  
  eliminar = async (req, res) => {
      try {
          const { id } = req.params;
          
          if (!id) {
              return res.status(400).json({
                  'estado': false,
                  'mensaje': 'ID del servicio es requerido'
              });
          }

          const resultado = await this.serviciosService.eliminar(id);
          if (resultado && resultado.affectedRows === 0) {
              return res.status(404).json({
                  'estado': false,
                  'mensaje': 'Servicio no encontrado'
              });
          }

          res.json({
              'estado': true,
              'mensaje': 'Servicio eliminado correctamente'
          });

      } catch (error) {
          console.log("Error en DELETE /servicios/:id", error);
          res.status(500).json({
              'estado': false,
              'mensaje': 'Error interno del servidor'
          });
      }
  }
}