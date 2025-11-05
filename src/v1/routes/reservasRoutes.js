import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasController from "../../controllers/reservasController.js";
import multer from "multer";
import path from "path";

const reservasController = new ReservasController();
const router = express.Router();

// Configuración de Multer para subir foto del cumpleañero
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cumpleanieros/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cumple_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", reservasController.buscarTodos);
router.get("/:id", reservasController.buscarPorId);
router.post("/", upload.single("foto_cumpleaniero"), reservasController.crear);
router.put("/:id", upload.single("foto_cumpleaniero"), reservasController.editar);
router.delete("/:id", reservasController.eliminar);

export default router;
