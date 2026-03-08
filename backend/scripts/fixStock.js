import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();

const fixStockAndSizes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const products = await Product.find({});
        console.log(`Buscando en ${products.length} productos...`);

        let updatedCount = 0;

        for (const product of products) {
            let changed = false;

            // 1. Quitar duplicados en los talles usando un Map
            if (product.sizes && product.sizes.length > 0) {
                const uniqueSizes = new Map();
                for (const s of product.sizes) {
                    if (!uniqueSizes.has(s.size)) {
                        // Asignar stock aleatorio si es 0, para que todos tengan stock
                        const newStock = s.stock === 0 ? Math.floor(Math.random() * 50) + 10 : s.stock;
                        uniqueSizes.set(s.size, { size: s.size, stock: newStock });
                    }
                }

                const newSizesArray = Array.from(uniqueSizes.values());

                // Si la longitud cambia o asignamos stock aleatorio, lo guardamos
                if (newSizesArray.length !== product.sizes.length || newSizesArray.some((s, i) => s.stock !== product.sizes[i].stock)) {
                    product.sizes = newSizesArray;
                    changed = true;
                }
            } else {
                // Si no tiene talles, asignarle un talle 'Única' con stock al azar
                product.sizes = [{ size: 'Única', stock: Math.floor(Math.random() * 50) + 10 }];
                changed = true;
            }

            if (changed) {
                // Forzar recalculado de totalStock (lo hace el pre-save del modelo)
                await product.save();
                updatedCount++;
            }
        }

        console.log(`¡Listo! Se actualizaron ${updatedCount} productos con stock aleatorio y se eliminaron tállez duplicados.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixStockAndSizes();
