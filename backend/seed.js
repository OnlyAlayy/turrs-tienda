import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Brand from './models/Brand.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/turrs-tienda';

const seedBrands = [
    { name: 'AFA', slug: 'afa', isActive: true, isFeatured: true },
    { name: 'Adidas', slug: 'adidas', isActive: true, isFeatured: true },
    { name: 'Nike', slug: 'nike', isActive: true, isFeatured: true },
    { name: 'Lacoste', slug: 'lacoste', isActive: true },
    { name: 'Ralph Lauren', slug: 'ralph-lauren', isActive: true },
    { name: 'Carolina Herrera', slug: 'carolina-herrera', isActive: true },
];

const seedProducts = [
    // CAMISETAS
    {
        name: 'Camiseta Argentina 2026 Titular',
        slug: 'camiseta-argentina-2026-titular',
        description: 'La camiseta de la historia. Tres estrellas. Una identidad.',
        price: 120,
        images: ['/images/products/arg_titular.jpg'],
        category: 'camisetas',
        brand: 'afa',
        sizes: [
            { size: 'S', stock: 50 }, { size: 'M', stock: 100 },
            { size: 'L', stock: 100 }, { size: 'XL', stock: 50 }, { size: 'XXL', stock: 20 }
        ],
        isFeatured: true,
        isLimitedEdition: true
    },
    {
        name: 'Camiseta Argentina 2026 Alternativa',
        slug: 'camiseta-argentina-2026-alternativa',
        description: 'La alternativa oficial para el último baile.',
        price: 110,
        images: ['/images/products/arg_alternativa.jpg'],
        category: 'camisetas',
        brand: 'afa',
        sizes: [
            { size: 'S', stock: 30 }, { size: 'M', stock: 60 },
            { size: 'L', stock: 60 }, { size: 'XL', stock: 30 }
        ]
    },
    {
        name: 'Camiseta Retro Argentina 1986',
        slug: 'camiseta-retro-argentina-1986',
        description: 'Edición especial retro 1986.',
        price: 95,
        images: ['/images/products/arg_1986.jpg'],
        category: 'camisetas',
        brand: 'afa',
        sizes: [
            { size: 'M', stock: 10 }, { size: 'L', stock: 15 }
        ]
    },
    {
        name: 'Camiseta Retro Argentina 1978',
        slug: 'camiseta-retro-argentina-1978',
        description: 'Edición especial retro 1978.',
        price: 95,
        images: ['/images/products/arg_1978.jpg'],
        category: 'camisetas',
        brand: 'afa',
        sizes: [
            { size: 'M', stock: 10 }, { size: 'L', stock: 15 }
        ]
    },

    // ROPA DEPORTIVA ADIDAS
    {
        name: 'Buzo con Capucha Adidas Essentials',
        slug: 'buzo-con-capucha-adidas-essentials',
        description: 'Buzo clásico de algodón.',
        price: 85,
        images: ['/images/products/adidas_buzo.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'buzos',
        brand: 'adidas',
        sizes: [{ size: 'S', stock: 20 }, { size: 'M', stock: 40 }, { size: 'L', stock: 40 }]
    },
    {
        name: 'Campera Adidas Tiro 2026',
        slug: 'campera-adidas-tiro-2026',
        description: 'Campera de entrenamiento.',
        price: 110,
        images: ['/images/products/adidas_campera.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'camperas',
        brand: 'adidas',
        sizes: [{ size: 'M', stock: 30 }, { size: 'L', stock: 30 }]
    },
    {
        name: 'Short Adidas Training Argentina',
        slug: 'short-adidas-training-argentina',
        description: 'Short oficial de entrenamiento.',
        price: 55,
        images: ['/images/products/adidas_short.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'shorts',
        brand: 'adidas',
        sizes: [{ size: 'M', stock: 50 }, { size: 'L', stock: 50 }]
    },
    {
        name: 'Remera Adidas Techfit Compression',
        slug: 'remera-adidas-techfit-compression',
        description: 'Remera térmica de compresión.',
        price: 65,
        images: ['/images/products/adidas_remera.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'remeras',
        brand: 'adidas',
        sizes: [{ size: 'S', stock: 20 }, { size: 'M', stock: 40 }, { size: 'L', stock: 40 }]
    },

    // ROPA DEPORTIVA NIKE
    {
        name: 'Buzo Nike Tech Fleece',
        slug: 'buzo-nike-tech-fleece',
        description: 'Innovación en abrigo.',
        price: 130,
        images: ['/images/products/nike_buzo.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'buzos',
        brand: 'nike',
        isBestSeller: true,
        sizes: [{ size: 'M', stock: 20 }, { size: 'L', stock: 20 }]
    },
    {
        name: 'Campera Nike Windrunner',
        slug: 'campera-nike-windrunner',
        description: 'Campera rompevientos clásica.',
        price: 145,
        images: ['/images/products/nike_campera.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'camperas',
        brand: 'nike',
        sizes: [{ size: 'M', stock: 15 }, { size: 'L', stock: 15 }]
    },
    {
        name: 'Short Nike Dri-FIT',
        slug: 'short-nike-dri-fit',
        description: 'Short para correr ligero.',
        price: 50,
        images: ['/images/products/nike_short.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'shorts',
        brand: 'nike',
        sizes: [{ size: 'M', stock: 40 }, { size: 'L', stock: 40 }]
    },
    {
        name: 'Remera Nike Dri-FIT Training',
        slug: 'remera-nike-dri-fit-training',
        description: 'Remera transpirable para entrenar.',
        price: 55,
        images: ['/images/products/nike_remera.jpg'],
        category: 'ropa-deportiva',
        subcategory: 'remeras',
        brand: 'nike',
        sizes: [{ size: 'M', stock: 50 }, { size: 'L', stock: 50 }]
    },

    // CALZADO
    {
        name: 'Adidas Predator Elite FG',
        slug: 'adidas-predator-elite-fg',
        description: 'Botines de fútbol profesionales.',
        price: 280,
        images: ['/images/products/adidas_predator.jpg'],
        category: 'calzado',
        subcategory: 'futbol',
        brand: 'adidas',
        sizes: [
            { size: '39', stock: 5 }, { size: '40', stock: 10 }, { size: '41', stock: 15 },
            { size: '42', stock: 15 }, { size: '43', stock: 10 }
        ]
    },
    {
        name: 'Nike Mercurial Superfly 10',
        slug: 'nike-mercurial-superfly-10',
        description: 'Botines de velocidad pura.',
        price: 320,
        images: ['/images/products/nike_mercurial.jpg'],
        category: 'calzado',
        subcategory: 'futbol',
        brand: 'nike',
        isBestSeller: true,
        sizes: [
            { size: '40', stock: 5 }, { size: '41', stock: 10 }, { size: '42', stock: 10 }
        ]
    },
    {
        name: 'Adidas Ultraboost 24',
        slug: 'adidas-ultraboost-24',
        description: 'Zapatillas de running máxima amortiguación.',
        price: 220,
        images: ['/images/products/adidas_ultraboost.jpg'],
        category: 'calzado',
        subcategory: 'running',
        brand: 'adidas',
        sizes: [
            { size: '39', stock: 10 }, { size: '40', stock: 20 }, { size: '41', stock: 20 },
            { size: '42', stock: 20 }, { size: '43', stock: 10 }
        ]
    },

    // PERFUMES
    {
        name: 'Adidas Team Force EDT 100ml',
        slug: 'adidas-team-force-edt-100ml',
        description: 'Energía pura en cada gota.',
        price: 45,
        images: ['/images/products/perfume_adidas.jpg'],
        category: 'perfumes',
        brand: 'adidas',
        fragrance: {
            concentration: 'Eau de Toilette',
            topNotes: ['Lima', 'Bergamota'],
            heartNotes: ['Menta', 'Lavanda'],
            baseNotes: ['Almizcle', 'Cedro'],
            gender: 'masculino',
            longevity: '4-8hs'
        },
        sizes: [{ size: '100ml', stock: 50 }]
    },
    {
        name: 'Nike Sport EDT 75ml',
        slug: 'nike-sport-edt-75ml',
        description: 'Fragancia deportiva fresca.',
        price: 55,
        images: ['/images/products/perfume_nike.jpg'],
        category: 'perfumes',
        brand: 'nike',
        fragrance: {
            concentration: 'Eau de Toilette',
            topNotes: ['Mandarina', 'Pomelo'],
            heartNotes: ['Jengibre', 'Cardamomo'],
            baseNotes: ['Vetiver', 'Ámbar'],
            gender: 'masculino',
            longevity: '4-8hs'
        },
        sizes: [{ size: '75ml', stock: 40 }]
    },
    {
        name: 'Lacoste L.12.12 Blanc EDT 100ml',
        slug: 'lacoste-l1212-blanc-edt-100ml',
        description: 'Elegancia clásica en blanco.',
        price: 95,
        images: ['/images/products/perfume_lacoste.jpg'],
        category: 'perfumes',
        brand: 'lacoste',
        isBestSeller: true,
        fragrance: {
            concentration: 'Eau de Toilette',
            topNotes: ['Pomelo', 'Bergamota'],
            heartNotes: ['Petitgrain', 'Iris'],
            baseNotes: ['Vetiver', 'Almizcle Blanco'],
            gender: 'masculino',
            longevity: '4-8hs'
        },
        sizes: [{ size: '100ml', stock: 30 }]
    },
    {
        name: 'Ralph Lauren Polo Blue EDT 125ml',
        slug: 'ralph-lauren-polo-blue-edt-125ml',
        description: 'Frescura oceánica inconfundible.',
        price: 110,
        images: ['/images/products/perfume_ralph.jpg'],
        category: 'perfumes',
        brand: 'ralph-lauren',
        fragrance: {
            concentration: 'Eau de Toilette',
            topNotes: ['Melón', 'Pepino', 'Mandarina'],
            heartNotes: ['Salvia', 'Geranio', 'Cardamomo'],
            baseNotes: ['Cedro', 'Musgo de Roble'],
            gender: 'masculino',
            longevity: '8+hs'
        },
        sizes: [{ size: '125ml', stock: 25 }]
    },
    {
        name: 'Carolina Herrera 212 NYC EDT 100ml',
        slug: 'carolina-herrera-212-nyc-edt-100ml',
        description: 'El ritmo vibrante de la ciudad.',
        price: 105,
        images: ['/images/products/perfume_ch.jpg'],
        category: 'perfumes',
        brand: 'carolina-herrera',
        fragrance: {
            concentration: 'Eau de Toilette',
            topNotes: ['Gardenia', 'Magnolia', 'Bergamota'],
            heartNotes: ['Rosa', 'Lirio del Valle'],
            baseNotes: ['Madera de Sándalo', 'Almizcle'],
            gender: 'femenino',
            longevity: '4-8hs'
        },
        sizes: [{ size: '100ml', stock: 30 }]
    },

    // ACCESORIOS Y EQUIPAMIENTO
    {
        name: 'Pelota Adidas Al Rihla 2026 Official',
        slug: 'pelota-adidas-al-rihla-2026-official',
        description: 'Balón oficial de partido.',
        price: 180,
        images: ['/images/products/pelota_adidas.jpg'],
        category: 'equipamiento',
        brand: 'adidas',
        sizes: [{ size: 'Única', stock: 15 }]
    },
    {
        name: 'Mochila Adidas Tiro League',
        slug: 'mochila-adidas-tiro-league',
        description: 'Mochila de entrenamiento espaciosa.',
        price: 65,
        images: ['/images/products/mochila_adidas.jpg'],
        category: 'accesorios',
        brand: 'adidas',
        sizes: [{ size: 'Única', stock: 40 }]
    },
    {
        name: 'Gorra Nike Dri-FIT Legacy91',
        slug: 'gorra-nike-dri-fit-legacy91',
        description: 'Gorra deportiva de alto rendimiento.',
        price: 38,
        images: ['/images/products/gorra_nike.jpg'],
        category: 'accesorios',
        brand: 'nike',
        sizes: [{ size: 'Única', stock: 50 }]
    },
    {
        name: 'Medias Adidas Argentina Pack 3 pares',
        slug: 'medias-adidas-argentina-pack-3',
        description: 'Pack de medias oficiales.',
        price: 22,
        images: ['/images/products/medias_adidas.jpg'],
        category: 'accesorios',
        brand: 'adidas',
        sizes: [{ size: 'Única', stock: 100 }]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Limpiar base de datos (sólo productos y marcas)
        await Product.deleteMany({});
        await Brand.deleteMany({});
        console.log('Cleared Products and Brands');

        // Insertar marcas
        const insertedBrands = await Brand.insertMany(seedBrands);
        console.log(`Inserted ${insertedBrands.length} brands`);

        // Insertar productos
        const insertedProducts = await Product.insertMany(seedProducts);
        console.log(`Inserted ${insertedProducts.length} products`);

        // Actualizar count de productos en marcas
        for (const brand of insertedBrands) {
            const count = await Product.countDocuments({ brand: brand.slug });
            brand.productCount = count;
            await brand.save();
        }
        console.log('Updated brand product counts');

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
