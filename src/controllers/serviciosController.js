import ServiciosService from "../services/serviciosService.js";

export default class ServiciosController {

    constructor() {
        this.serviciosService = new ServiciosService();
    }

    buscarTodos = async (req, res) => {
         try {
            
            const servicios = await this.serviciosService.buscarTodos();

            res.json({ 'estado': true , 'datos': servicios });
        
          } catch (error) {
            console.log("Error en GET /servicios", error);
            res.status(500).json({ 
              'estado': false , 
              'mensaje': `Error interno del servidor` 
            });
          }
    }

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
    
}