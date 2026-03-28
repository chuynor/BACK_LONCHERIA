import express from 'express';
import * as usuarioController from '../controllers/user.controller.js';
import { authApp } from '../middlewares/authApp.js'; // Importamos el middleware

const router = express.Router();

router.post('/register', authApp, usuarioController.registrar); // Añadimos authApp
router.post('/login', authApp, usuarioController.login); // Añadimos authApp para consistencia

export default router;