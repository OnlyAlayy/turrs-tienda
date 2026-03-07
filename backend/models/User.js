import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Casa' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  streetNumber: { type: String, required: true },
  floor: { type: String },
  apartment: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // NO required, para permitir OAuth
    minlength: 6
  },
  // Nombre original para retrocompatibilidad
  name: {
    type: String,
    // NO required para evitar bug si la app dependía estrictamente de él en login
    trim: true
  },

  // Identidad
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dni: { type: String, trim: true },
  phone: { type: String, trim: true },

  // Auth
  googleId: { type: String, sparse: true },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  avatar: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },

  // Addresses array (max 3)
  addresses: {
    type: [addressSchema],
    validate: {
      validator: (arr) => arr.length <= 3,
      message: 'Máximo 3 direcciones de envío'
    }
  },

  // Meta
  profileComplete: { type: Boolean, default: false },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encriptar password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Comparar passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);