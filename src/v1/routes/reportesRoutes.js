import express from "express";
import ReportesController from "../../controllers/reportesController.js";

const reportesController = new ReportesController();
const router = express.Router();

router.get("/", reportesController.getReportes);

export default router;

