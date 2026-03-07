import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import passport from 'passport';
import './config/passport.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js'; // 🔹 mantenemos la ruta de pagos (MercadoPago)
import stripeRoutes from './routes/stripe.js'; // 🔹 nueva ruta de Stripe
import newsletterRoutes from './routes/newsletter.js'; // 🔹 nueva ruta de Newsletter
import contactRoutes from './routes/contact.js'; // Contacto
import usersRoutes from './routes/users.js'; // Usuarios

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
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
app.use('/api/payments', paymentRoutes); // MercadoPago
app.use('/api/stripe', stripeRoutes); // Stripe
app.use('/api/newsletter', newsletterRoutes); // Newsletter
app.use('/api/contact', contactRoutes); // Contacto
app.use('/api/users', usersRoutes); // Usuarios

// Ruta básica de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API de TURRS Tienda' });
});

// Ruta de health check (útil para verificar estado del server y la DB)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

// Ruta por defecto para manejar 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
