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
    enum: ['bebida', 'comida', 'postre', 'otro'],
    default: 'otro'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagen: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;
