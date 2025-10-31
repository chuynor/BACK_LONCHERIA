import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_TOKEN_SECRET || 'secretousuariotoken';
const APP_TOKEN = process.env.APP_TOKEN || 'tokenDeApp123';

export const registrarUsuario = async (data) => {
  const { nombre, email, password, rol } = data;

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) throw new Error('El correo ya está registrado');

  const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, rol });
  await nuevoUsuario.save();

  return nuevoUsuario;
};

export const loginUsuario = async (email, password) => {
  const usuario = await Usuario.findOne({ email });
  if (!usuario) throw new Error('Credenciales inválidas');

  const match = await bcrypt.compare(password, usuario.password);
  if (!match) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: usuario._id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { usuario, token };
};

export const verificarAppToken = (token) => {
  return token === APP_TOKEN;
};
