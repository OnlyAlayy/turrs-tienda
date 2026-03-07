import express from 'express';
import Product from '../models/Product.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();


// backend/routes/products.js - AGREGAR ESTA RUTA
router.get('/featured', async (req, res) => {
  try {
    // Obtener productos destacados (puedes usar un campo 'featured' o limitar)
    const featuredProducts = await Product.find().limit(4); // Modificado para devolver 4 productos
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error al obtener productos destacados' });
  }
});
import mongoose from 'mongoose';

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, brand, subcategory, gender, size, concentration } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    // We filtering post-query if a brand slug is provided since brand is an ObjectId reference.

    // Let's refine the filter based on what the frontend actually sends
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (gender) filter['fragranceProfile.gender'] = gender;
    if (concentration) filter['fragranceProfile.concentration'] = concentration;

    if (size) {
      filter.sizes = { $elemMatch: { size: size, stock: { $gt: 0 } } };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Product.find(filter).sort({ createdAt: -1 }).populate('brand');
    const products = await query.exec();

    // If frontend sent brand slug, and brand is populated, we might need to filter post-query if we can't easily filter pre-query.
    // Or we expect frontend to pass brand ID.
    // But let's just return products. The frontend useProducts hook might pass brand.

    // To properly support brand slug filtering:
    if (brand) {
      const filteredByBrand = products.filter(p => {
        if (!p.brand) return false;
        // Check if brand is populated or just an ObjectId
        const isPopulated = typeof p.brand === 'object' && p.brand._id;
        if (isPopulated) {
          return p.brand.slug === brand || p.brand._id.toString() === brand;
        }
        return p.brand.toString() === brand;
      });
      return res.json(filteredByBrand);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// GET - Obtener producto por ID o Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const param = req.params.idOrSlug;
    let product;

    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param).populate('brand');
    }

    if (!product) {
      product = await Product.findOne({ slug: param }).populate('brand');
    }

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// POST - Crear producto (solo admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creando producto', error: error.message });
  }
});

// PUT - Actualizar producto (solo admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error actualizando producto', error: error.message });
  }
});

// DELETE - Eliminar producto (solo admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});



export default router;