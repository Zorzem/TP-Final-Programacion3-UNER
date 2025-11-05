import express from "express";
import EncuestasController from "../../controllers/encuestasController.js";

const encuestasController = new EncuestasController();
const router = express.Router();

router.get("/", encuestasController.buscarTodos);
router.get("/:id", encuestasController.buscarPorId);
router.get("/usuario/:usuarioId", encuestasController.buscarPorUsuario);
router.get("/salon/:salonId", encuestasController.buscarPorSalon);
router.post("/", encuestasController.crear);
router.put("/:id", encuestasController.editar);
router.delete("/:id", encuestasController.eliminar);

export default router;