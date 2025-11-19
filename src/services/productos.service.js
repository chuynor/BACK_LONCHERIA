import Producto from '../models/productos.model.js';

export const crearProducto = async (data) => {
  const nuevoProducto = new Producto(data);
  return await nuevoProducto.save();
};

export const obtenerProductos = async () => {
  return await Producto.find();
};

export const obtenerProductoPorId = async (id) => {
  return await Producto.findById(id);
};

export const actualizarProducto = async (id, data) => {
  return await Producto.findByIdAndUpdate(id, data, { new: true });
};

export const eliminarProducto = async (id) => {
  return await Producto.findByIdAndDelete(id);
};
