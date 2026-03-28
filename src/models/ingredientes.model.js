import mongoose from 'mongoose';

const ingredienteSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true,
    lowercase: true 
  },
  unidad: { 
    type: String, 
    enum: ['kg', 'l', 'pieza'], 
    required: true, 
    default: 'kg' 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  stockMinimo: { 
    type: Number, 
    min: 0, 
    default: 5 
  }
}, { timestamps: true });

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export default Ingrediente;