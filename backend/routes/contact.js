import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Todos los campos requeridos incompletos' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        if (message.length < 10) {
            return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres' });
        }

        const newMessage = new ContactMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        await newMessage.save();

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Contact Submit Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
