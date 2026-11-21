const mongoose = require('mongoose');

const medicineItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genericName: String,
  category: {
    type: String,
    enum: ['Antidiabetic', 'Antihypertensive', 'Antibiotic', 'Analgesic', 'Bronchodilator', 'Cardiovascular', 'Antacid', 'Anticoagulant', 'Vitamin/Supplement', 'Other'],
    default: 'Other',
  },
  dosage: {
    type: String,
    required: true, // e.g. "500 mg", "10 mg"
  },
  form: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Inhaler', 'Injection', 'Drops'],
    default: 'Tablet',
  },
  frequency: {
    type: String,
    required: true, // e.g. "Once Daily (1-0-0)", "Twice Daily (1-0-1)", "Thrice Daily (1-1-1)"
  },
  mealTiming: {
    type: String,
    enum: ['Before Food (Empty Stomach)', 'After Food', 'With Food', 'Bedtime (Night)', 'As Needed (SOS)'],
    default: 'After Food',
  },
  timingSlots: [{
    slot: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'] },
    timeString: String, // e.g. "08:00 AM"
  }],
  durationDays: {
    type: Number,
    default: 30,
  },
  instructions: String,
  instructionsLocal: {
    hi: String,
    kn: String,
  },
});

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: String,
  hospitalName: String,
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
  },
  diagnosis: String,
  medicines: [medicineItemSchema],
  clashWarnings: [{
    severity: { type: String, enum: ['HIGH', 'MODERATE', 'LOW'] },
    drugsInvolved: [String],
    issue: String,
    recommendation: String,
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Discontinued'],
    default: 'Active',
  },
  prescribedDate: {
    type: Date,
    default: Date.now,
  },
  validUntil: Date,
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
