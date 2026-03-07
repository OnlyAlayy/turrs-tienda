import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.find({});
        for (const p of products) {
            // Assign a high quality generic product placeholder 
            p.images = ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"];
            await p.save();
        }
        console.log("Fixed images for " + products.length + " products in DB!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixImages();
