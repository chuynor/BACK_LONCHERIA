//productos.service.js
import mongoose from 'mongoose';
import Producto from '../models/productos.model.js';
import Ingrediente from '../models/ingredientes.model.js';

// CRUD básico productos

// Al crear un producto, los ingredientes deben ser [{ ingrediente: ObjectId, cantidad, unidad }]
export const crearProducto = async (payload) => {
    // Validar que los ingredientes existan y transformar si es necesario
    if (payload.ingredientes && Array.isArray(payload.ingredientes)) {
        for (const item of payload.ingredientes) {
            // Si el ingrediente es un objeto con id, lo dejamos, si es string, lo convertimos
            if (item.ingrediente && typeof item.ingrediente === 'object' && item.ingrediente._id) {
                item.ingrediente = item.ingrediente._id;
            }
        }
    }
    const producto = new Producto(payload);
    return await producto.save();
};


export const obtenerProductos = async (filtros = {}, opciones = {}) => {
    const { limit = 50, skip = 0, sort = { createdAt: -1 }, populate = false } = opciones;
    let query = Producto.find(filtros).limit(limit).skip(skip).sort(sort);
    if (populate) query = query.populate('ingredientes.ingrediente');
    return await query.lean();
};


export const obtenerProductoPorId = async (id, populate = false) => {
    let q = Producto.findById(id);
    if (populate) q = q.populate('ingredientes.ingrediente');
    return await q.lean();
};


export const actualizarProducto = async (id, cambios) => {
    // Si se actualizan ingredientes, asegurarse de que son referencias
    if (cambios.ingredientes && Array.isArray(cambios.ingredientes)) {
        for (const item of cambios.ingredientes) {
            if (item.ingrediente && typeof item.ingrediente === 'object' && item.ingrediente._id) {
                item.ingrediente = item.ingrediente._id;
            }
        }
    }
    return await Producto.findByIdAndUpdate(id, cambios, { new: true });
};


export const eliminarProducto = async (id) => {
    return await Producto.findByIdAndDelete(id);
};

/**
 * procesarVenta:
 * - productoId: id del producto vendido
 * - cantidadVendida: unidades vendidas (por defecto 1)
 * Logica:
 * - Inicia una session/transaction.
 * - Carga el producto con populate a ingredientes.
 * - Verifica que cada ingrediente tenga stock suficiente.
 * - Descuenta la cantidad requerida en cada ingrediente (usando sesión).
 * - Recalcula disponibilidad del producto (si algún ingrediente queda por debajo de lo necesario).
 * - Commit / abort según corresponda.
 */

export const procesarVenta = async (productoId, cantidadVendida = 1) => {
    if (cantidadVendida <= 0) throw new Error('cantidadVendida debe ser mayor a 0');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Cargar producto con ingredientes referenciados
        const producto = await Producto.findById(productoId).populate('ingredientes.ingrediente').session(session);
        if (!producto) throw new Error('Producto no encontrado');

        if (!producto.disponible) throw new Error('Producto no disponible para la venta');

        // Verificar stock de cada ingrediente
        for (const item of producto.ingredientes) {
            const necesario = item.cantidad * cantidadVendida;
            const ingrDoc = item.ingrediente;
            if (!ingrDoc) throw new Error(`Ingrediente referenciado no existe (producto: ${producto.nombre})`);
            if (ingrDoc.cantidad < necesario) {
                throw new Error(`Stock insuficiente para ingrediente ${ingrDoc.nombre}`);
            }
        }

        // Descontar stock de cada ingrediente (usando la lógica de ingredientes.service.js)
        for (const item of producto.ingredientes) {
            const necesario = item.cantidad * cantidadVendida;
            const res = await Ingrediente.findOneAndUpdate(
                { _id: item.ingrediente._id, cantidad: { $gte: necesario } },
                { $inc: { cantidad: -necesario } },
                { session, new: true }
            );
            if (!res) throw new Error(`Error al descontar stock del ingrediente ${item.ingrediente.nombre}`);
        }

        // Recalcular disponibilidad: si alguno de los ingredientes quedó por debajo de la cantidad necesaria para 1 unidad,
        // marcar producto como no disponible.
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