import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const arabianPerfumes = [
    {
        name: "Lattafa Asad",
        slug: "lattafa-asad-turrs",
        description: "Una fragancia cálida y especiada, perfecta para quienes buscan un aroma potente y duradero.",
        shortDescription: "Perfume árabe cálido y amaderado",
        price: 45000,
        compareAtPrice: 55000,
        images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800"],
        category: "perfumes",
        brand: "turrs",
        sizes: [{ size: "100ml", stock: 15 }],
        fragrance: {
            concentration: "Eau de Parfum",
            topNotes: ["Pimienta negra", "Piña", "Tabaco"],
            heartNotes: ["Café", "Iris", "Pachulí"],
            baseNotes: ["Ámbar", "Vainilla", "Maderas secas"],
            sillage: "Fuerte",
            longevity: "Muy Alta",
            gender: "masculino"
        },
        isActive: true,
        isFeatured: true,
        isNewArrival: true
    },
    {
        name: "Afnan Supremacy Not Only Intense",
        slug: "afnan-supremacy-turrs",
        description: "Una mezcla exótica de frutas y humo, conocida por su increíble proyección y parecido a los perfumes nicho más famosos.",
        shortDescription: "Aroma afrutado y ahumado intenso",
        price: 65000,
        compareAtPrice: 80000,
        images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800"],
        category: "perfumes",
        brand: "turrs",
        sizes: [{ size: "100ml", stock: 10 }],
        fragrance: {
            concentration: "Parfum",
            topNotes: ["Grosellas negras", "Bergamota", "Manzana"],
            heartNotes: ["Musgo de roble", "Pachulí", "Lavanda"],
            baseNotes: ["Ámbar gris", "Almizcle", "Azafrán"],
            sillage: "Fuerte",
            longevity: "Muy Alta",
            gender: "masculino"
        },
        isActive: true,
        isFeatured: true
    },
    {
        name: "Armaf Club de Nuit Intense Man",
        slug: "club-de-nuit-intense-turrs",
        description: "El perfume árabe más famoso, conocido por su versatilidad y su salida cítrica ahumada.",
        shortDescription: "Cítrico, ahumado y súper versátil",
        price: 55000,
        images: ["https://images.unsplash.com/photo-1595425970377-c9703c5efc05?w=800"],
        category: "perfumes",
        brand: "turrs",
        sizes: [{ size: "105ml", stock: 25 }],
        fragrance: {
            concentration: "Eau de Toilette",
            topNotes: ["Limón", "Piña", "Bergamota", "Grosellas negras"],
            heartNotes: ["Abedul", "Jazmín", "Rosa"],
            baseNotes: ["Almizcle", "Ámbar gris", "Pachulí", "Vainilla"],
            sillage: "Moderada/Fuerte",
            longevity: "Alta",
            gender: "masculino"
        },
        isActive: true,
        isBestSeller: true
    },
    {
        name: "Lattafa Yara",
        slug: "lattafa-yara-turrs",
        description: "Un perfume dulce, cremoso y ultra femenino. Destaca por sus notas atalcadas y su aroma a postre tropical.",
        shortDescription: "Dulce, tropical y cremoso",
        price: 42000,
        images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800"],
        category: "perfumes",
        brand: "turrs",
        sizes: [{ size: "100ml", stock: 20 }],
        fragrance: {
            concentration: "Eau de Parfum",
            topNotes: ["Orquídea", "Heliotropo", "Naranja tangerina"],
            heartNotes: ["Acorde gourmand", "Fruta tropical"],
            baseNotes: ["Vainilla", "Almizcle", "Sándalo"],
            sillage: "Moderada",
            longevity: "Alta",
            gender: "femenino"
        },
        isActive: true,
        isFeatured: true,
        isBestSeller: true
    }
];

const seedArabianPerfumes = async () => {
    try {
        await connectDB();

        console.log('Borrando perfumes arabes turrs antiguos (si existen)...');
        await Product.deleteMany({ brand: 'turrs' });

        console.log('Insertando nuevos perfumes...');
        await Product.insertMany(arabianPerfumes);

        console.log('Perfumes árabes de marca TURRS insertados con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('Error insertando los perfumes:', error);
        process.exit(1);
    }
};

seedArabianPerfumes();
