const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  doctorName: {
    type: String,
    required: true,
  },
  doctorSpecialization: String,
  hospitalName: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  visitType: {
    type: String,
    enum: ['OPD', 'OPD Consultation', 'Emergency', 'Follow-up', 'Routine Checkup', 'General Consultation'],
    default: 'OPD',
  },
  chiefComplaints: [{
    type: String,
    required: true,
  }],
  diagnosis: {
    type: String,
    required: true,
  },
  icdCode: String,
  clinicalObservations: String,
  vitalsRecorded: {
    bp: String,
    pulse: Number,
    spo2: Number,
    temp: Number,
    glucose: Number,
  },
  investigationsOrdered: [String],
  treatmentPlan: String,
  followUpDate: Date,
  attachments: [{
    title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
