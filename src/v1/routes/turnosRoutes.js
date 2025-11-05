import express from "express";
import TurnosController from "../../controllers/turnosController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const turnosController = new TurnosController();
const router = express.Router();

router.get("/",autorizarUsuarios([1,2,3]), turnosController.buscarTodos);
router.get("/:id",autorizarUsuarios([1,2,3]), turnosController.buscarPorId);

router.post("/",autorizarUsuarios([1,2]), turnosController.crear);
router.put("/:id",autorizarUsuarios([1,2]), turnosController.editar);
router.delete("/:id",autorizarUsuarios([1,2]), turnosController.eliminar);

export default router;