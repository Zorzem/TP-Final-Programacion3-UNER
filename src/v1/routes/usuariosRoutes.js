// src/v1/routes/usuariosRoutes.js

import express from "express";
import UsuariosController from "../../controllers/usuariosController.js";

const router = express.Router();
const usuariosController = new UsuariosController();

router.get("/", usuariosController.buscarTodos);
router.get("/:id", usuariosController.buscarPorId);
router.post("/", usuariosController.crear);
router.put("/:id", usuariosController.editar);
router.delete("/:id", usuariosController.eliminar);

export default router;