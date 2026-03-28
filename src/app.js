import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productoRoutes from './routes/productos.route.js';
import usuarioRoutes from './routes/user.route.js';
import ingredienteRoutes from './routes/ingredientes.route.js';

import { authApp } from './middlewares/authApp.js';


dotenv.config();

export function buildApp() {
  const app = express();

  app.use(cors(
    {origin:'http://localhost:5173',allowedHeaders: ['Content-Type', 'Authorization','x-app-token','ngrok-skip-browser-warning'],}
  ));
  app.use(express.json());

  const mongoURI = `mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.CLUSTER}/loncheria?retryWrites=true&w=majority`;

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log(' Conectado a MongoDB Atlas'))
    .catch(err => console.error(' Error al conectar a MongoDB:', err));

  app.use('/api/usuarios', authApp , usuarioRoutes);
  app.use('/api/productos', authApp , productoRoutes);
  app.use('/api/ingredientes', authApp , ingredienteRoutes);

  // Ruta no encontrada
  app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
  });

  return app;
}
