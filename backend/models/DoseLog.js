const mongoose = require('mongoose');

const doseLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: String,
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  slot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    required: true,
  },
  scheduledTimeString: String, // e.g. "08:30 AM"
  status: {
    type: String,
    enum: ['TAKEN', 'MISSED', 'SKIPPED', 'PENDING'],
    default: 'PENDING',
  },
  takenAt: Date,
  markedBy: {
    type: String,
    enum: ['PATIENT', 'CAREGIVER', 'SYSTEM_TIMEOUT'],
    default: 'PATIENT',
  },
  notes: String,
}, { timestamps: true });

doseLogSchema.index({ patientId: 1, date: 1, medicineName: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('DoseLog', doseLogSchema);
