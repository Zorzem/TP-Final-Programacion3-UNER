// src/v1/routes/usuariosRoutes.js
import express from "express";
import UsuariosController from "../../controllers/usuariosController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();
const usuariosController = new UsuariosController();

router.get("/",autorizarUsuarios([1]), usuariosController.buscarTodos);
router.get("/:id",autorizarUsuarios([1]), usuariosController.buscarPorId);
router.post("/",autorizarUsuarios([1]), usuariosController.crear);
router.put("/:id",autorizarUsuarios([1]), usuariosController.editar);
router.delete("/:id",autorizarUsuarios([1]), usuariosController.eliminar);

export default router;