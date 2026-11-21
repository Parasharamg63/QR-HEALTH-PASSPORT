const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'caregiver', 'admin'],
    default: 'patient',
  },
  phone: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn', 'ta', 'te', 'es'],
  },
  avatar: {
    type: String,
  },
  doctorDetails: {
    specialization: String,
    licenseNumber: String,
    hospital: String,
    department: String,
    experienceYears: Number,
  },
  isDemoUser: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Prevent double-hashing if password is already hashed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
