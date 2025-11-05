import express from "express";
import SalonesController from "../../controllers/salonesController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const salonesController = new SalonesController();
const router = express.Router();




router.get("/",autorizarUsuarios([1,2,3]), salonesController.buscarTodos);
router.get("/:id",autorizarUsuarios([1,2,3]), salonesController.buscarPorId);

router.post("/",autorizarUsuarios([1,2]), salonesController.crear);
router.put("/:id",autorizarUsuarios([1,2]), salonesController.editar);
router.delete("/:id",autorizarUsuarios([1,2]), salonesController.eliminar);


export default router;