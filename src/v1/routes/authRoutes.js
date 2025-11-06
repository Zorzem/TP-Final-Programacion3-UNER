// src/v1/routes/authRoutes.js

import express from "express";
import AuthController from "../../controllers/authController.js";
import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Manejo de acceso de usuarios y generación de tokens
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token de autenticación
 *     tags: [Autenticación]
 *     description: Verifica las credenciales del usuario y devuelve un token JWT si son correctas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: usuario@example.com
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, se devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Inicio de sesión exitoso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error en los datos enviados o formato incorrecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El correo electrónico es requerido!"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario o contraseña incorrectos"
 */
router.post(
  "/login",
    [
      check("nombre_usuario", "El correo electrónico es requerido!").not().isEmpty(),
      check("nombre_usuario", "Revisar el formato del correo electrónico!").isEmail(),
      check("contrasenia", "La contraseña es requerida!").not().isEmpty(),
      validarCampos,
    ],
    authController.login
);

export default router;
