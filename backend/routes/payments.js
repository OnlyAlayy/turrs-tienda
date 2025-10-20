import express from 'express';
import { createPreference, getPayment } from '../utils/mercadopago.js';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

// POST - Crear preferencia de pago
router.post('/create-preference', authenticate, async (req, res) => {
  try {
    const { items, orderId } = req.body;

    if (!items || !orderId) {
      return res.status(400).json({ message: 'Items y orderId son requeridos' });
    }

    const preference = await createPreference(items, orderId);
    
    res.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener información de pago
router.get('/:paymentId', authenticate, async (req, res) => {
  try {
    const payment = await getPayment(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Webhook para notificaciones de pago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = await getPayment(data.id);
      
      if (payment.status === 'approved') {
        // Actualizar orden como pagada
        await Order.findByIdAndUpdate(
          payment.external_reference,
          { status: 'paid' },
          { new: true }
        );
        console.log(`Orden ${payment.external_reference} marcada como pagada`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

export default router;