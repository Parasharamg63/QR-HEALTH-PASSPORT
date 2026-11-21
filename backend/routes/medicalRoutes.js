const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const HealthPassport = require('../models/HealthPassport');
const ConsentSession = require('../models/ConsentSession');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/medical/add-treatment
// @desc    Doctor gives clinical treatment & updates the patient's medical history
router.post('/add-treatment', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const {
      patientId,
      sessionId,
      visitType,
      chiefComplaints,
      diagnosis,
      clinicalObservations,
      vitalsRecorded,
      investigationsOrdered,
      treatmentPlan,
      followUpDate,
      medicines,
    } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Patient ID and Diagnosis are required.' });
    }

    // Verify valid patient consent was granted
    if (sessionId) {
      const session = await ConsentSession.findById(sessionId);
      if (!session || session.status !== 'GRANTED') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Valid patient consent is required before updating medical history.',
        });
      }
    }

    // 1. Create the new Clinical Medical Record in patient history
    const record = await MedicalRecord.create({
      patientId,
      doctorId: req.user._id,
      doctorName: req.user.name,
      doctorSpecialization: req.user.doctorDetails?.specialization || 'Consultant Physician',
      hospitalName: req.user.doctorDetails?.hospital || 'City Healthcare Center',
      visitDate: new Date(),
      visitType: visitType || 'OPD',
      chiefComplaints: Array.isArray(chiefComplaints) ? chiefComplaints : [chiefComplaints || 'General Examination'],
      diagnosis,
      clinicalObservations: clinicalObservations || '',
      vitalsRecorded: vitalsRecorded || {},
      investigationsOrdered: investigationsOrdered || [],
      treatmentPlan: treatmentPlan || '',
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    });

    // 2. If medicines prescribed, save prescription record
    let prescription = null;
    if (medicines && medicines.length > 0) {
      prescription = await Prescription.create({
        patientId,
        doctorId: req.user._id,
        doctorName: req.user.name,
        hospitalName: req.user.doctorDetails?.hospital || 'City Healthcare Center',
        recordId: record._id,
        diagnosis,
        medicines: medicines.map(m => ({
          name: m.name,
          dosage: m.dosage || 'Standard',
          frequency: m.frequency || 'Once Daily',
          mealTiming: m.mealTiming || 'After Food',
          instructions: m.instructions || '',
        })),
        status: 'Active',
        prescribedDate: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    // 3. Update patient's vitals & history in Health Passport
    const passport = await HealthPassport.findOne({ userId: patientId });
    if (passport && vitalsRecorded) {
      passport.currentVitals = {
        bloodPressure: vitalsRecorded.bp || passport.currentVitals.bloodPressure,
        heartRate: Number(vitalsRecorded.pulse) || passport.currentVitals.heartRate,
        bloodSugar: Number(vitalsRecorded.glucose) || passport.currentVitals.bloodSugar,
        spo2: Number(vitalsRecorded.spo2) || passport.currentVitals.spo2,
        temperature: Number(vitalsRecorded.temp) || passport.currentVitals.temperature,
        lastUpdated: new Date(),
      };
      passport.vitalsHistory.push({
        bloodPressure: vitalsRecorded.bp || passport.currentVitals.bloodPressure,
        heartRate: Number(vitalsRecorded.pulse) || passport.currentVitals.heartRate,
        bloodSugar: Number(vitalsRecorded.glucose) || passport.currentVitals.bloodSugar,
        spo2: Number(vitalsRecorded.spo2) || passport.currentVitals.spo2,
        temperature: Number(vitalsRecorded.temp) || passport.currentVitals.temperature,
        recordedBy: req.user.name,
        recordedAt: new Date(),
      });
      await passport.save();
    }

    res.status(201).json({
      success: true,
      message: 'Treatment successfully given and patient medical history updated permanently.',
      record,
      prescription,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record treatment: ' + err.message });
  }
});

// @route   GET /api/medical/records/:patientId
// @desc    Get complete chronological medical history for a patient
router.get('/records/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId }).sort({ visitDate: -1 });
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ prescribedDate: -1 });

    res.json({
      success: true,
      records,
      prescriptions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
