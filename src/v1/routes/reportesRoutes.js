import express from "express";
import ReportesController from "../../controllers/reportesController.js";
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const reportesController = new ReportesController();
const router = express.Router();

router.get("/", autorizarUsuarios([1]), reportesController.getReportes);

export default router;

