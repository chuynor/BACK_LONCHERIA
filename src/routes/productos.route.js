import express from 'express';
import * as productoController from '../controllers/productos.controller.js';
import { authApp } from '../middlewares/authApp.js'; // Importamos authApp
import { authUser } from '../middlewares/authUsers.js'; // Importamos authUser

const router = express.Router();

// Rutas protegidas con authApp (todas) y authUser (POST, PUT, DELETE)
router.post('/', authApp, authUser, productoController.crearProducto);
router.get('/', authApp, productoController.obtenerProductos);
router.get('/:id', authApp, productoController.obtenerProductoPorId);
router.put('/:id', authApp, authUser, productoController.actualizarProducto);
router.delete('/:id', authApp, authUser, productoController.eliminarProducto);

export default router;