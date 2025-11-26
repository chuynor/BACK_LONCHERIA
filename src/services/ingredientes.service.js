// services/ingredientes.service.js
import Ingrediente from '../models/ingredientes.model.js';

export const crearIngrediente = async (payload) => {
  const ingr = new Ingrediente(payload);
  return await ingr.save();
};

export const obtenerIngredientes = async (filtros = {}, opciones = {}) => {
  const { limit = 100, skip = 0, sort = { createdAt: -1 } } = opciones;
  return await Ingrediente.find(filtros).limit(limit).skip(skip).sort(sort).exec();
};

export const obtenerIngredientePorId = async (id) => {
  return await Ingrediente.findById(id).exec();
};

export const actualizarIngrediente = async (id, cambios) => {
  return await Ingrediente.findByIdAndUpdate(id, cambios, { new: true });
};

export const eliminarIngrediente = async (id) => {
  return await Ingrediente.findByIdAndDelete(id);
};

export const agregarStock = async (id, cantidad) => {
  if (cantidad <= 0) throw new Error('cantidad debe ser > 0');
  return await Ingrediente.findByIdAndUpdate(id, { $inc: { cantidad } }, { new: true });
};