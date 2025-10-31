import express from 'express';
import * as usuarioController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

export default router;
