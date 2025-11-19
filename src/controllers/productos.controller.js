import * as productoService from '../services/productos.service.js';
import mongoose from 'mongoose';
// Modelo temporal para validar existencia de ingredientes por nombre
const Ingrediente = mongoose.models.Ingrediente || mongoose.model('Ingrediente', new mongoose.Schema({ nombre: String }, { collection: 'ingredientes' }));

// Valida que los ingredientes tengan estructura y existan en la base de datos por nombre
const validarIngredientes = async (ingredientes) => {
  if (!Array.isArray(ingredientes)) return;
  for (const item of ingredientes) {
    if (!item.nombre || typeof item.nombre !== 'string') {
      throw new Error('Cada ingrediente debe tener un campo nombre (string)');
    }
    if (typeof item.cantidad !== 'number' || item.cantidad <= 0) {
      throw new Error(`El ingrediente ${item.nombre} debe tener una cantidad numérica mayor a 0`);
    }
    if (!item.unidad || typeof item.unidad !== 'string') {
      throw new Error(`El ingrediente ${item.nombre} debe tener una unidad válida`);
    }
    // Verifica que el ingrediente exista en la base de datos por nombre
    const existe = await Ingrediente.findOne({ nombre: item.nombre });
    if (!existe) throw new Error(`Ingrediente no encontrado en la base de datos: ${item.nombre}`);
  }
};

export const crearProducto = async (req, res) => {
  try {
    if (req.body.ingredientes) {
      await validarIngredientes(req.body.ingredientes);
    }
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
    if (req.body.ingredientes) {
      await validarIngredientes(req.body.ingredientes);
    }
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
