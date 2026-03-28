import express from 'express';
import * as ingredientesController from '../controllers/ingredientes.controller.js';
import { authApp } from '../middlewares/authApp.js';
import { authUser } from '../middlewares/authUsers.js';

const router = express.Router();

router.post('/', authApp, authUser, ingredientesController.crearIngrediente);
router.get('/', authApp, ingredientesController.obtenerIngredientes);
router.get('/:id', authApp, ingredientesController.obtenerIngredientePorId);
router.put('/:id', authApp, authUser, ingredientesController.actualizarIngrediente);
router.delete('/:id', authApp, authUser, ingredientesController.eliminarIngrediente);
router.post('/:id/stock', authApp, authUser, ingredientesController.agregarStock);

export default router;