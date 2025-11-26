import * as ingredienteService from '../services/ingredientes.service.js';

export const crearIngrediente = async (req, res) => {
  try {
    const ingr = await ingredienteService.crearIngrediente(req.body);
    return res.status(201).json(ingr);
  } catch (err) {
    return res.status(400).json({ ok: false, mensaje: err.message });
  }
};

export const obtenerIngredientes = async (req, res) => {
  try {
    const lista = await ingredienteService.obtenerIngredientes();
    return res.json(lista);
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const obtenerIngredientePorId = async (req, res) => {
  try {
    const ingr = await ingredienteService.obtenerIngredientePorId(req.params.id);
    if (!ingr) return res.status(404).json({ ok: false, mensaje: 'Ingrediente no encontrado' });
    return res.json(ingr);
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const actualizarIngrediente = async (req, res) => {
  try {
    const updated = await ingredienteService.actualizarIngrediente(req.params.id, req.body);
    if (!updated) return res.status(404).json({ ok: false, mensaje: 'Ingrediente no encontrado' });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarIngrediente = async (req, res) => {
  try {
    const deleted = await ingredienteService.eliminarIngrediente(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, mensaje: 'Ingrediente no encontrado' });
    return res.json({ ok: true, mensaje: 'Eliminado' });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const agregarStock = async (req, res) => {
  try {
    const cantidad = Number(req.body.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) return res.status(400).json({ ok: false, mensaje: 'cantidad inválida' });
    const updated = await ingredienteService.agregarStock(req.params.id, cantidad);
    return res.json({ ok: true, ingrediente: updated });
  } catch (err) {
    return res.status(400).json({ ok: false, mensaje: err.message });
  }
};