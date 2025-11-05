import express from "express";
import ServiciosController from "../../controllers/serviciosController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const serviciosController = new ServiciosController();
const router = express.Router();

router.get("/",autorizarUsuarios([1,2,3]), serviciosController.buscarTodos);
router.get("/:id",autorizarUsuarios([1,2,3]), serviciosController.buscarPorId);


router.post("/",autorizarUsuarios([1,2]), serviciosController.crear);
router.put("/:id",autorizarUsuarios([1,2]), serviciosController.editar);
router.delete("/:id",autorizarUsuarios([1,2]), serviciosController.eliminar);

export default router;