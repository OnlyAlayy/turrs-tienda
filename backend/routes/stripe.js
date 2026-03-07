import express from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get the key from env or use a safe sandbox placeholder to prevent crash
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
    apiVersion: '2023-10-16',
});

// POST - Crear Stripe Checkout Session
router.post('/create-checkout-session', authenticate, async (req, res) => {
    try {
        const { items, orderId } = req.body;

        if (!items || !orderId) {
            return res.status(400).json({ message: 'Items y orderId son requeridos' });
        }

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'ars', // Or your store currency like usd
                product_data: {
                    name: `${item.name} - ${item.size || 'Única'}`,
                    images: [item.image],
                },
                // Stripe expects amounts in the smallest currency unit (e.g., cents)
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-confirmation/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`,
            client_reference_id: orderId.toString(),
            metadata: { orderId: orderId.toString() },
        });

        res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST - Webhook para notificaciones de pago (This must use raw body, so we export it as such)
// For Express, raw body middleware must be set up before this route in server.js or here.
// But for simplicity, we mock the logic if real webhook signatures are used.

export default router;
