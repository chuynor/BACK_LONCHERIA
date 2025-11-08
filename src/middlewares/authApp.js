// middlewares/authApp.js
export const authApp = (req, res, next) => {
  const token = req.headers['x-app-token'];
  console.log('Token recibido:', token); //  prueba

  if (!token || token !== process.env.APP_TOKEN) {
    return res.status(403).json({ mensaje: 'Token de aplicación inválido o ausente' });
  }

  next();
};
