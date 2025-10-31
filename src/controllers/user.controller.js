import * as usuarioService from '../services/user.service.js';

export const registrar = async (req, res) => {
  try {
    const appToken = req.headers['x-app-token'];
    if (!usuarioService.verificarAppToken(appToken)) {
      return res.status(403).json({ mensaje: 'Token de aplicación inválido' });
    }

    const usuario = await usuarioService.registrarUsuario(req.body);
    res.status(201).json({ mensaje: 'Usuario registrado', usuario });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const appToken = req.headers['x-app-token'];
    if (!usuarioService.verificarAppToken(appToken)) {
      return res.status(403).json({ mensaje: 'Token de aplicación inválido' });
    }

    const { email, password } = req.body;
    const { usuario, token } = await usuarioService.loginUsuario(email, password);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      token
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};
