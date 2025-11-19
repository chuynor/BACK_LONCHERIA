// services/ingredientes.service.js
import mongoose from 'mongoose';
import Ingrediente from '../models/ingredientes.model.js';

export const crearIngrediente = async (payload) => {
    const ingr = new Ingrediente(payload);
    return await ingr.save();
};

export const obtenerIngredientes = async (filtros = {}, opciones = {}) => {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = opciones;
    return await Ingrediente.find(filtros).limit(limit).skip(skip).sort(sort).lean();
};

export const obtenerIngredientePorId = async (id) => {
    return await Ingrediente.findById(id).lean();
};

export const actualizarIngrediente = async (id, cambios) => {
    return await Ingrediente.findByIdAndUpdate(id, cambios, { new: true });
};

export const eliminarIngrediente = async (id) => {
    return await Ingrediente.findByIdAndDelete(id);
};

// Incrementar stock (cantidad positiva), usada para recargas
export const agregarStock = async (id, cantidad, session = null) => {
    if (cantidad <= 0) throw new Error('La cantidad a agregar debe ser mayor a 0');
    const opts = session ? { session, new: true } : { new: true };
    return await Ingrediente.findByIdAndUpdate(id, { $inc: { cantidad } }, opts);
};

// Reducir stock (cantidad positiva), devuelve el documento actualizado
export const reducirStock = async (id, cantidad, session = null) => {
    if (cantidad <= 0) throw new Error('La cantidad a reducir debe ser mayor a 0');
    const opts = session ? { session, new: true } : { new: true };
    // Usamos $inc negativo
    const updated = await Ingrediente.findOneAndUpdate(
        { _id: id, cantidad: { $gte: cantidad } }, // asegura stock suficiente
        { $inc: { cantidad: -cantidad } },
        opts
    );
    if (!updated) throw new Error('Stock insuficiente o ingrediente no encontrado');
    return updated;
};