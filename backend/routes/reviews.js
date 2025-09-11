import express from 'express';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET - Obtener reseñas de un producto
router.get('/product/:productId', async (req, res) => {
  try {
    const { rating } = req.query;
    let filter = { productId: req.params.productId };

    if (rating) filter.rating = parseInt(rating);

    const reviews = await Review.find(filter)
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// POST - Crear reseña
router.post('/', authenticate, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Error creando reseña', error: error.message });
  }
});

// GET - Estadísticas de reseñas por producto
router.get('/stats/:productId', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(req.params.productId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

export default router;