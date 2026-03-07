import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ""
  },
  shortDescription: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: [
      'camisetas',
      'ropa-deportiva',
      'calzado',
      'perfumes',
      'accesorios',
      'coleccionables',
      'equipamiento'
    ],
    required: true
  },
  subcategory: {
    type: String
  },
  brand: {
    type: String,
    enum: [
      'afa',
      'adidas',
      'nike',
      'puma',
      'under-armour',
      'carolina-herrera',
      'lacoste',
      'ralph-lauren',
      'turrs',
      'sin-marca'
    ],
    required: true
  },
  brandLogo: {
    type: String
  },
  sizes: [{
    size: String,
    stock: { type: Number, default: 0, min: 0 }
  }],
  totalStock: {
    type: Number,
    default: 0,
    min: 0
  },
  fragrance: {
    concentration: {
      type: String,
      enum: ['Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne', 'Parfum', null]
    },
    topNotes: [String],
    heartNotes: [String],
    baseNotes: [String],
    sillage: String,
    longevity: String,
    gender: {
      type: String,
      enum: ['masculino', 'femenino', 'unisex', null]
    }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isLimitedEdition: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  stripeProductId: { type: String },
  stripePriceId: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isActive: 1 });

productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
  next();
});

export default mongoose.model('Product', productSchema);