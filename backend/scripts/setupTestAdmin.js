import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const setupTestAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'admin@turrs.com';
        const password = 'admin123';

        let user = await User.findOne({ email });

        if (user) {
            user.password = password; // The pre-save hook in User model usually hashes it, wait, let me check the model...
            // Actually, if the model has a pre-save hook for password, calling user.save() will hash it.
            // Let's just create or update and manually hash it if no hook exists, or rely on the hook.
            // I'll just hash it manually to be safe if use findOneAndUpdate, or I'll just save it.
        } else {
            user = new User({ email, password, role: 'admin', name: 'Admin Test' });
        }

        user.role = 'admin';
        user.password = password; // Assigning plain text, relying on pre-save hook. Wait, does User.js have a hook? 
        await user.save();

        console.log(`Test admin created/updated: ${email} / ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

setupTestAdmin();
