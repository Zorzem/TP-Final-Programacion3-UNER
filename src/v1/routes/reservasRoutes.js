import express from "express";
import ReservasController from "../../controllers/reservasController.js";

const reservasController = new ReservasController();
const router = express.Router();

router.get("/", reservasController.buscarTodos);
router.get("/:id", reservasController.buscarPorId);
router.post("/", reservasController.crear);
router.put("/:id", reservasController.editar);
router.delete("/:id", reservasController.eliminar);

export default router;