import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = process.argv[2];
        if (!email) {
            console.log('Uso: node makeAdmin.js email@ejemplo.com');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log('Usuario no encontrado');
        } else {
            console.log(`✓ ${user.email} ahora es admin`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
