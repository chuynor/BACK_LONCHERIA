import { buildApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const app = buildApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
