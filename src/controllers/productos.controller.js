//productos.controller.js
import * as productoService from '../services/productos.service.js';
import Ingrediente from '../models/ingredientes.model.js';

/**
 * Valida que los ingredientes enviados tengan la estructura esperada:
 * - arreglo no vacío
 * - cada item: { ingrediente: ObjectId|string, cantidad: number > 0 }
 * - que todos los ingredientes existan en la colección Ingrediente
 * - evita duplicados de ingrediente en el mismo producto
 */
const validarIngredientes = async (ingredientes) => {
  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    throw new Error('Se requiere un arreglo de ingredientes no vacío');
  }

  const ids = [];
  for (const item of ingredientes) {
    if (!item || (typeof item !== 'object')) {
      throw new Error('Cada ingrediente debe ser un objeto con { ingrediente, cantidad }');
    }
    if (!item.ingrediente) {
      throw new Error('Cada ingrediente debe incluir el campo "ingrediente" con el id del ingrediente');
    }
    if (typeof item.cantidad !== 'number' || item.cantidad <= 0) {
      throw new Error('Cada ingrediente debe incluir "cantidad" numérica mayor a 0');
    }
    ids.push(item.ingrediente.toString());
  }

  // detectar duplicados
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length !== ids.length) {
    throw new Error('No se permiten ingredientes duplicados en la lista del producto');
  }

  // verificar existencia en DB
  const count = await Ingrediente.countDocuments({ _id: { $in: uniqueIds } });
  if (count !== uniqueIds.length) {
    throw new Error('Uno o más ingredientes referenciados no existen');
  }
};

export const crearProducto = async (req, res) => {
  try {
    if (req.body.ingredientes) {
      await validarIngredientes(req.body.ingredientes);
    } else {
      // exigir ingredientes según requerimiento
      return res.status(400).json({ mensaje: 'El producto debe contener al menos un ingrediente' });
    }

    const producto = await productoService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    // opcional: permitir ?populate=true para devolver ingredientes poblados
    const populate = req.query.populate === 'true';
    const productos = await productoService.obtenerProductos({}, { populate });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const populate = req.query.populate === 'true';
    const producto = await productoService.obtenerProductoPorId(req.params.id, populate);
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

export const venderProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const cantidad = Number(req.body.cantidad || 1);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'cantidad debe ser un número mayor a 0' });
    }

    const result = await productoService.procesarVenta(id, cantidad);
    return res.status(200).json(result);
  } catch (err) {
    const msg = err.message || 'Error al procesar venta';
    if (msg.toLowerCase().includes('no encontrado')) {
      return res.status(404).json({ mensaje: msg });
    }
    if (msg.toLowerCase().includes('insuficiente') || msg.toLowerCase().includes('no disponible')) {
      return res.status(400).json({ mensaje: msg });
    }
    return res.status(500).json({ mensaje: msg });
  }
};