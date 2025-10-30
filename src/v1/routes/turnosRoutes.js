import express from "express";
import TurnosController from "../../controllers/turnosController.js";

const turnosController = new TurnosController();
const router = express.Router();

router.get("/", turnosController.buscarTodos);
router.get("/:id", turnosController.buscarPorId);
router.post("/", turnosController.crear);
router.put("/:id", turnosController.editar);
router.delete("/:id", turnosController.eliminar);

export default router;