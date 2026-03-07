import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET - Obtener todas las órdenes con filtros, paginación y estadísticas (solo admin)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { status, search, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filters
    if (status && status !== 'Todos los estados' && status !== 'Todos') {
      // Map frontend status labels if needed, or assume exact keys. Let's rely on exact keys passed from frontend
      // If frontend sends pending, paid, etc.
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        let endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    if (search) {
      const users = await mongoose.model('User').find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      }, '_id');
      const userIds = users.map(u => u._id);

      const searchConditions = [{ userId: { $in: userIds } }];
      if (mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({ _id: search });
      } else {
        searchConditions.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: search,
              options: "i"
            }
          }
        });
      }
      query.$or = searchConditions;
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Global stats across all orders
    const statsAgg = await Order.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          counts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          totalOrders: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    const statsResult = statsAgg[0];
    const totalRev = statsResult.totalRevenue[0]?.total || 0;
    const totOrd = statsResult.totalOrders[0]?.count || 0;

    const statusCounts = statsResult.counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const stats = {
      totalRevenue: totalRev,
      totalOrders: totOrd,
      pendingCount: statusCounts.pending || 0,
      paidCount: statusCounts.paid || 0,
      processingCount: statusCounts.processing || 0,
      shippedCount: statusCounts.shipped || 0,
      deliveredCount: statusCounts.delivered || 0,
      cancelledCount: statusCounts.cancelled || 0
    };

    const totalFiltered = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalFiltered / Number(limit));

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName name email phone dni avatar')
      .populate('products.productId', 'name slug images category brand')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      orders,
      total: totalFiltered,
      page: Number(page),
      totalPages,
      stats
    });
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
      .populate('userId', 'firstName lastName name email phone dni avatar')
      .populate('products.productId', 'name slug price images category brand');

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
    const { products } = req.body;

    // Validate stock
    if (products && products.length > 0) {
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Find the selected size
        const sizeInfo = product.sizes?.find(s => s.size === item.size || s.size === 'Única');
        const availableStock = sizeInfo ? sizeInfo.stock : 0;

        if (availableStock < item.quantity) {
          return res.status(400).json({
            message: `Stock insuficiente para ${product.name} (Seleccionado: ${item.size || 'Única'}). Disponible: ${availableStock}. Por favor actualiza tu carrito.`
          });
        }
      }
    }

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
    ).populate('userId', 'firstName lastName name email phone dni avatar')
      .populate('products.productId', 'name slug price images category brand');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando orden', error: error.message });
  }
});

// PATCH - Actualizar estado de orden
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { status, trackingNumber } = req.body;
    const updateData = { status };

    if (status === 'shipped') {
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName name email phone dni avatar')
      .populate('products.productId', 'name slug price images category brand');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando estado', error: error.message });
  }
});

export default router;