import express from "express";
import EncuestasController from "../../controllers/encuestasController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';


const encuestasController = new EncuestasController();
const router = express.Router();

router.get("/", autorizarUsuarios([1]), encuestasController.buscarTodos);
router.get("/:id", autorizarUsuarios([1]), encuestasController.buscarPorId);
router.get("/usuario/:usuarioId", autorizarUsuarios([1]), encuestasController.buscarPorUsuario);
router.get("/salon/:salonId", autorizarUsuarios([1]), encuestasController.buscarPorSalon);
router.post("/", autorizarUsuarios([3]), encuestasController.crear);
router.put("/:id", autorizarUsuarios([1]), encuestasController.editar);
router.delete("/:id", autorizarUsuarios([1]), encuestasController.eliminar);

export default router;