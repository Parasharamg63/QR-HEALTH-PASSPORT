const mongoose = require('mongoose');

const healthPassportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  abhaId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passportToken: {
    type: String,
    required: true,
    unique: true,
  },
  qrCodeDataUrl: {
    type: String,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown',
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  address: {
    villageOrCity: String,
    district: String,
    state: String,
    pincode: String,
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
    secondaryPhone: String,
  },
  chronicConditions: [{
    name: { type: String, required: true },
    diagnosedYear: Number,
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Moderate' },
    notes: String,
  }],
  allergies: [{
    allergen: { type: String, required: true },
    reaction: String,
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe / Life Threatening'], default: 'Moderate' },
  }],
  organDonor: {
    type: Boolean,
    default: false,
  },
  consentPIN: {
    type: String,
    default: '1234',
  },
  currentVitals: {
    bloodPressure: { type: String, default: '120/80' },
    heartRate: { type: Number, default: 72 },
    bloodSugar: { type: Number, default: 110 }, // mg/dL
    spo2: { type: Number, default: 98 }, // %
    temperature: { type: Number, default: 98.6 }, // °F
    weight: { type: Number, default: 68 }, // kg
    height: { type: Number, default: 170 }, // cm
    lastUpdated: { type: Date, default: Date.now },
  },
  vitalsHistory: [{
    bloodPressure: String,
    heartRate: Number,
    bloodSugar: Number,
    spo2: Number,
    temperature: Number,
    recordedAt: { type: Date, default: Date.now },
    recordedBy: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('HealthPassport', healthPassportSchema);
