import express from "express";
import ServiciosController from "../../controllers/serviciosController.js";

const serviciosController = new ServiciosController();
const router = express.Router();

router.get("/", serviciosController.buscarTodos);
router.get("/:id", serviciosController.buscarPorId);
router.put("/:id", serviciosController.editar);


export { router };
