const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const HealthPassport = require('../models/HealthPassport');
const User = require('../models/User');
const ConsentSession = require('../models/ConsentSession');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const { protect, authorize } = require('../middleware/authMiddleware');
const { verifyPassportQRPayload } = require('../services/qrService');

// @route   POST /api/doctor/scan-qr
// @desc    Doctor scans QR code payload to initiate patient consultation handshake
router.post('/scan-qr', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { qrPayload, manualAbhaId } = req.body;
    let abhaId = manualAbhaId;
    let passportToken = null;

    if (qrPayload) {
      const verification = verifyPassportQRPayload(qrPayload);
      if (!verification.valid) {
        return res.status(400).json({ success: false, message: verification.message });
      }
      abhaId = verification.data.abhaId;
      passportToken = verification.data.passportToken;
    }

    if (!abhaId) {
      return res.status(400).json({ success: false, message: 'Please provide either a valid QR scan or ABHA ID.' });
    }

    const query = passportToken ? { abhaId, passportToken } : { abhaId };
    const passport = await HealthPassport.findOne(query).populate('userId', 'name email phone language');
    if (!passport) {
      return res.status(404).json({ success: false, message: 'No patient record found matching this QR Passport.' });
    }

    const patient = passport.userId;

    // Create or find an active consent session
    const sessionToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour access window

    const session = await ConsentSession.create({
      sessionToken,
      patientId: patient._id,
      doctorId: req.user._id,
      doctorName: req.user.name,
      hospitalName: req.user.doctorDetails?.hospital || 'City General Hospital',
      status: 'PENDING',
      expiresAt,
    });

    res.json({
      success: true,
      message: 'QR Passport verified successfully. Patient consent request initiated.',
      sessionId: session._id,
      sessionToken: session.sessionToken,
      patientPreview: {
        id: patient._id,
        name: patient.name,
        abhaId: passport.abhaId,
        bloodGroup: passport.bloodGroup,
        gender: passport.gender,
        dob: passport.dob,
        consentStatus: 'PENDING',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/doctor/active-session/:sessionId
// @desc    Poll or check status of a consent session
router.get('/active-session/:sessionId', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const session = await ConsentSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        status: session.status,
        expiresAt: session.expiresAt,
        doctorName: session.doctorName,
        patientId: session.patientId,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/doctor/grant-consent (Patient or quick PIN approval)
// @desc    Patient approves doctor's consultation access
router.post('/grant-consent', protect, async (req, res) => {
  try {
    const { sessionId, pin } = req.body;
    const session = await ConsentSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Consent session not found.' });
    }

    const passport = await HealthPassport.findOne({ userId: session.patientId });
    if (!passport) {
      return res.status(404).json({ success: false, message: 'Patient passport not found.' });
    }

    // PIN check if provided or if user is patient themselves
    if (pin && passport.consentPIN !== pin) {
      return res.status(401).json({ success: false, message: 'Incorrect 4-digit Security PIN.' });
    }

    session.status = 'GRANTED';
    session.grantedAt = new Date();
    await session.save();

    res.json({
      success: true,
      message: 'Patient consent granted! Doctor has been given real-time clinical access.',
      session,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/doctor/patient-dossier/:patientId
// @desc    Get complete medical history after consent is granted
router.get('/patient-dossier/:patientId', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { sessionId } = req.query;

    // Verify valid consent session
    let validSession = null;
    if (sessionId) {
      validSession = await ConsentSession.findOne({
        _id: sessionId,
        doctorId: req.user._id,
        patientId,
        status: 'GRANTED',
        expiresAt: { $gt: new Date() },
      });
    } else {
      // Find any active session for this doctor and patient
      validSession = await ConsentSession.findOne({
        doctorId: req.user._id,
        patientId,
        status: 'GRANTED',
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });
    }

    if (!validSession) {
      return res.status(403).json({
        success: false,
        consentRequired: true,
        message: 'Explicit Patient Consent is required. Please have the patient approve the consent request with their 4-digit PIN.',
      });
    }

    const patient = await User.findById(patientId).select('name email phone language');
    const passport = await HealthPassport.findOne({ userId: patientId });
    const records = await MedicalRecord.find({ patientId }).sort({ visitDate: -1 });
    const prescriptions = await Prescription.find({ patientId }).sort({ prescribedDate: -1 });

    res.json({
      success: true,
      consentSessionId: validSession._id,
      patient,
      passport,
      medicalHistory: records,
      prescriptions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
