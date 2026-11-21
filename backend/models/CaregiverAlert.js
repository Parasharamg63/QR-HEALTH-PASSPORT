const mongoose = require('mongoose');

const caregiverAlertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: String,
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['MISSED_DOSE', 'SOS_EMERGENCY', 'VITALS_ABNORMAL', 'MEDICINE_CLASH_DETECTED', 'APPOINTMENT_REMINDER'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'],
    default: 'MEDIUM',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  metadata: {
    medicineName: String,
    scheduledSlot: String,
    vitalsRecorded: mongoose.Schema.Types.Mixed,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('CaregiverAlert', caregiverAlertSchema);
