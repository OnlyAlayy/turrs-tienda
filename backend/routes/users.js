import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes.'));
        }
    }
});

// PUT - Actualizar datos del perfil
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { name, firstName, lastName, dni, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (name !== undefined) user.name = name;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (dni !== undefined) user.dni = dni;
        if (phone !== undefined) user.phone = phone;

        // Si se cargan datos vitales, marcamos profileComplete (o se marcará en el modal)
        if (user.firstName && user.lastName && user.dni && user.phone) {
            user.profileComplete = true;
        }

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

// POST - Agregar dirección
router.post('/addresses', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (user.addresses.length >= 3) {
            return res.status(400).json({ message: 'Límite de 3 direcciones alcanzado' });
        }

        const newAddress = req.body;
        // Si es la primera, marcar como default
        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        } else if (newAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json({ message: 'Dirección agregada', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar dirección', error: error.message });
    }
});

// PUT - Editar dirección
router.put('/addresses/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);
        if (!address) return res.status(404).json({ message: 'Dirección no encontrada' });

        Object.assign(address, req.body);

        if (req.body.isDefault) {
            user.addresses.forEach(a => {
                if (a._id.toString() !== req.params.id) a.isDefault = false;
            });
        }

        await user.save();
        res.json({ message: 'Dirección actualizada', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar dirección', error: error.message });
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

// POST - Subir foto de perfil
router.post('/profile-photo', authenticate, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asegurar que el directorio uploads/avatars exista
        const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');
        try {
            await fs.access(avatarsDir);
        } catch {
            await fs.mkdir(avatarsDir, { recursive: true });
        }

        const filename = `avatar-${user._id}-${Date.now()}.webp`;
        const filepath = path.join(avatarsDir, filename);

        // Procesar imagen con sharp
        await sharp(req.file.buffer)
            .resize(150, 150, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(filepath);

        const avatarUrl = `/uploads/avatars/${filename}`;

        // Borrar el avatar viejo si existe y es local
        if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
            const oldPath = path.join(process.cwd(), user.avatar.replace('/', path.sep));
            try { await fs.unlink(oldPath); } catch (e) { /* ignore */ }
        }

        user.avatar = avatarUrl;
        await user.save();

        res.json({
            message: 'Foto de perfil actualizada',
            avatar: avatarUrl
        });

    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ message: 'Error al procesar la imagen', error: error.message });
    }
});

// DELETE - Eliminar dirección
router.delete('/addresses/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);

        // Si borramos la default y quedan otras, hacer default la primera
        const hasDefault = user.addresses.some(a => a.isDefault);
        if (!hasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json({ message: 'Dirección eliminada', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar dirección', error: error.message });
    }
});

export default router;
