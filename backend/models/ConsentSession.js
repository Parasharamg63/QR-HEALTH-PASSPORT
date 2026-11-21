const mongoose = require('mongoose');

const consentSessionSchema = new mongoose.Schema({
  sessionToken: {
    type: String,
    required: true,
    unique: true,
  },
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
  status: {
    type: String,
    enum: ['PENDING', 'GRANTED', 'DENIED', 'EXPIRED', 'REVOKED'],
    default: 'PENDING',
  },
  accessScope: {
    type: [String],
    default: ['medical_history', 'vitals', 'prescriptions', 'allergies', 'add_treatment'],
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  grantedAt: Date,
  revokedAt: Date,
  reason: {
    type: String,
    default: 'Clinical Consultation via QR Scan',
  },
}, { timestamps: true });

// Auto-expire after expiry
consentSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ConsentSession', consentSessionSchema);
