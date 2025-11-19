import mongoose from 'mongoose';

// Schema para ingredientes
const ingredienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  unidad: {
    type: String,
    required: true,
    enum: ['kg', 'l', 'unidad'],
    default: 'unidad'
  }
});

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['tortas', 'quesadillas', 'sandwiches', 'chocos', 'jugos'],
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagen: {
    type: String,
    default: ''
  },
  ingredientes: [ingredienteSchema]
}, { 
  timestamps: true 
});

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;






