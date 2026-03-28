import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productoRoutes from './producto.route.js';


dotenv.config();

const app = express();
app.use(express.json());

//  URL de conexión
const URL = `mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.CLUSTER}/?retryWrites=true&w=majority&appName=utrTest`;


mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Conectado a MongoDB Atlas'))
.catch(err => console.error(' Error al conectar a MongoDB:', err));


app.use('/api/productos', productoRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
