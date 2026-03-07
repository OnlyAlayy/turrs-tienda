import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.status(400).json({ error: 'duplicate' });
        }

        const newSubscriber = new Subscriber({ email: email.toLowerCase() });
        await newSubscriber.save();

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Newsletter Subscribe Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
