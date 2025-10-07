import express from "express";
import ServiciosController from "../../controllers/serviciosController.js";

const serviciosController = new ServiciosController();
const router = express.Router();

router.get("/", serviciosController.buscarTodos);
router.get("/:id", serviciosController.buscarPorId);
router.post("/",serviciosController.crear);
router.put("/:id", serviciosController.editar);
router.delete("/:id", serviciosController.eliminarServicio);


export { router };
