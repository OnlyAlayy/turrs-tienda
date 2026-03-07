import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// PUT - Actualizar datos del perfil
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.name = name || user.name;
        // Assuming schema is updated or schema accepts arbitrary via strict: false, 
        // but better if we only update defined fields. Let's assume phone exists or is added.
        user.phone = phone || user.phone;

        await user.save();

        res.json({
            message: 'Perfil actualizado exitosamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
});

// PUT - Cambiar contraseña
router.put('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar password actual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
});

// GET - Perfil (already in /verify basically, but let's provide a specific profile pull)
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
});

export default router;
