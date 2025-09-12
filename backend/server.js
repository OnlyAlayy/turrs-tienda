import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error conectando a MongoDB:', err));

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Ruta básica de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API de TURRS Tienda' });
});

// Ruta por defecto para manejar 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
