//productos.service.js
import mongoose from 'mongoose';
import Producto from '../models/productos.model.js';
import Ingrediente from '../models/ingredientes.model.js';

// CRUD básico productos
export const crearProducto = async (payload) => {
  const producto = new Producto(payload);
  return await producto.save();
};

export const obtenerProductos = async (filtros = {}, opciones = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 }, populate = false } = opciones;
  let query = Producto.find(filtros).limit(limit).skip(skip).sort(sort);
  if (populate) query = query.populate('ingredientes.ingrediente');
  return await query.exec();
};

export const obtenerProductoPorId = async (id, populate = false) => {
  let q = Producto.findById(id);
  if (populate) q = q.populate('ingredientes.ingrediente');
  return await q.exec();
};

export const actualizarProducto = async (id, cambios) => {
  return await Producto.findByIdAndUpdate(id, cambios, { new: true });
};

export const eliminarProducto = async (id) => {
  return await Producto.findByIdAndDelete(id);
};

export const procesarVenta = async (productoId, cantidadVendida = 1) => {
  if (cantidadVendida <= 0) throw new Error('cantidadVendida debe ser mayor a 0');

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const producto = await Producto.findById(productoId).populate('ingredientes.ingrediente').session(session);
    if (!producto) throw new Error('Producto no encontrado');
    if (!producto.disponible) throw new Error('Producto no disponible para la venta');

    // verificar stock
    for (const item of producto.ingredientes) {
      const necesario = item.cantidad * cantidadVendida;
      if (!item.ingrediente) throw new Error('Ingrediente referenciado no existe');
      if (item.ingrediente.cantidad < necesario) {
        throw new Error(`Stock insuficiente para ingrediente ${item.ingrediente.nombre}`);
      }
    }

    // descontar stock
    for (const item of producto.ingredientes) {
      const necesario = item.cantidad * cantidadVendida;
      const updated = await Ingrediente.findOneAndUpdate(
        { _id: item.ingrediente._id, cantidad: { $gte: necesario } },
        { $inc: { cantidad: -necesario } },
        { session, new: true }
      );
      if (!updated) throw new Error(`No se pudo descontar stock del ingrediente ${item.ingrediente.nombre}`);
    }

    // recalcular disponibilidad -> si algún ingrediente no alcanza para 1 unidad, marcar no disponible
    const ids = producto.ingredientes.map(i => i.ingrediente._id);
    const ingredientesActualizados = await Ingrediente.find({ _id: { $in: ids } }).session(session);

    const puedeVender = producto.ingredientes.every(i => {
      const ingr = ingredientesActualizados.find(ai => ai._id.equals(i.ingrediente._id));
      return ingr && ingr.cantidad >= i.cantidad;
    });

    if (!puedeVender) {
      producto.disponible = false;
      await producto.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return { ok: true, mensaje: 'Venta procesada' };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};