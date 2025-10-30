import express from "express";
import SalonesController from "../../controllers/salonesController.js";

const salonesController = new SalonesController();
const router = express.Router();

router.get("/", salonesController.buscarTodos);
router.get("/:id", salonesController.buscarPorId);
router.post("/", salonesController.crear);
router.put("/:id", salonesController.editar);
router.delete("/:id", salonesController.eliminar);

export default router;