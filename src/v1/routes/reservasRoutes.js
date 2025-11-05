import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import ReservasController from "../../controllers/reservasController.js";
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads/cumpleanieros');

// Crear carpeta uploads/cumpleanieros si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const reservasController = new ReservasController();
const router = express.Router();

// Configuración de Multer para subir foto del cumpleañero
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cumple_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get('/:reserva_id',  autorizarUsuarios([1,2,3]), reservasController.buscarPorId);

router.get('/',  autorizarUsuarios([1,2,3]), reservasController.buscarTodos);

router.post('/', autorizarUsuarios([1,3]),upload.single("foto_cumpleaniero"),
    [
        check('fecha_reserva', 'La fecha es necesaria.').notEmpty(),
        check('salon_id', 'El salón es necesario.').notEmpty(),
        check('usuario_id', 'El usuario es necesario.').notEmpty(), 
        check('turno_id', 'El turno es necesario.').notEmpty(),  
        check('servicios', 'Faltan los servicios de la reserva.')
        .notEmpty()
        .isArray(),
        check('servicios.*.importe')
        .isFloat() 
        .withMessage('El importe debe ser numérico.'),   
        validarCampos
    ],
    reservasController.crear);


router.put("/:id",  autorizarUsuarios([1]), upload.single("foto_cumpleaniero"), reservasController.editar);
router.delete("/:id", autorizarUsuarios([1]), reservasController.eliminar);

export default router;
