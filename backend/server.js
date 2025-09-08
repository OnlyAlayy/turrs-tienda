const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const testRoutes = require('./routes/test');

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

// Usar rutas
app.use('/api/test', testRoutes);

// Ruta básica de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API de TURRS Tienda' });
});

// Ruta por defecto para manejar 404 - CORREGIDO
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
});
