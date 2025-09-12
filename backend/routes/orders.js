import express from 'express';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET - Obtener todas las órdenes (solo admin)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// GET - Obtener órdenes del usuario actual
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// GET - Obtener orden específica
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price images');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Verificar que el usuario sea el dueño o admin
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// POST - Crear nueva orden
router.post('/', authenticate, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user._id
    };

    const order = new Order(orderData);
    await order.save();

    // Populate para devolver datos completos
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price images');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creando orden', error: error.message });
  }
});

// PUT - Actualizar orden (solo admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('products.productId', 'name price images');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando orden', error: error.message });
  }
});

export default router;