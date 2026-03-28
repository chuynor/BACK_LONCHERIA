//productos.route.js
import express from 'express';
import * as productoController from '../controllers/productos.controller.js';
import { authApp } from '../middlewares/authApp.js';
import { authUser } from '../middlewares/authUsers.js';

const router = express.Router();

router.post('/', authApp, authUser, productoController.crearProducto);
router.get('/', authApp, productoController.obtenerProductos);
router.get('/:id', authApp, productoController.obtenerProductoPorId);
router.put('/:id', authApp, authUser, productoController.actualizarProducto);
router.delete('/:id', authApp, authUser, productoController.eliminarProducto);
router.post('/:id/vender', authApp, productoController.venderProducto);

export default router;