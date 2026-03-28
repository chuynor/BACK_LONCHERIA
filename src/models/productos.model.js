import mongoose from 'mongoose';

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
  // ✅ INGREDIENTES COMO REFERENCIAS SEPARADAS
  ingredientes: [{
    ingrediente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingrediente',  // Referencia a la colección separada
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, { 
  timestamps: true 
});

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;