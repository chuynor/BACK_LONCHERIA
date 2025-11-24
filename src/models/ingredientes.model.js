import mongoose from 'mongoose';

const ingredienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true },
  // unidad solo permite litros (l) o kilogramos (kg)
  unidad: { type: String, enum: ['kg', 'l'], required: true, default: 'kg' },
  // cantidad en la unidad indicada (ej: 2.5 -> 2.5 kg o 1.5 -> 1.5 l)
  cantidad: { type: Number, required: true, min: 0 },
}, { timestamps: true });

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export default Ingrediente;