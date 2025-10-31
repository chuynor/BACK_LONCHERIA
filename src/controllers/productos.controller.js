import * as productoService from '../services/productos.service.js';

export const crearProducto = async (req, res) => {
  try {
    const producto = await productoService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const producto = await productoService.actualizarProducto(req.params.id, req.body);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await productoService.eliminarProducto(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
