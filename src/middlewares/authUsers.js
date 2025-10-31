import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Falta el token de autorización' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }

    req.user = user;
    next();
  });
};
