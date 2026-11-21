const express = require('express');
const router = express.Router();
const HealthPassport = require('../models/HealthPassport');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { generatePassportQRCode } = require('../services/qrService');

// @route   GET /api/passport/my-passport
// @desc    Get patient's full health passport & QR code
router.get('/my-passport', protect, async (req, res) => {
  try {
    const passport = await HealthPassport.findOne({ userId: req.user._id }).populate('userId', 'name email phone language');
    if (!passport) {
      return res.status(404).json({ success: false, message: 'Health Passport record not found.' });
    }
    res.json({ success: true, passport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/passport/update
// @desc    Update emergency contacts, allergies, conditions, or vitals
router.put('/update', protect, async (req, res) => {
  try {
    const { bloodGroup, emergencyContact, allergies, chronicConditions, currentVitals, consentPIN } = req.body;
    let passport = await HealthPassport.findOne({ userId: req.user._id });
    if (!passport) {
      return res.status(404).json({ success: false, message: 'Health Passport record not found.' });
    }

    if (bloodGroup) passport.bloodGroup = bloodGroup;
    if (emergencyContact) passport.emergencyContact = emergencyContact;
    if (allergies) passport.allergies = allergies;
    if (chronicConditions) passport.chronicConditions = chronicConditions;
    if (consentPIN) passport.consentPIN = consentPIN;
    if (currentVitals) {
      passport.currentVitals = { ...passport.currentVitals.toObject(), ...currentVitals, lastUpdated: new Date() };
      passport.vitalsHistory.push({
        bloodPressure: currentVitals.bloodPressure || passport.currentVitals.bloodPressure,
        heartRate: currentVitals.heartRate || passport.currentVitals.heartRate,
        bloodSugar: currentVitals.bloodSugar || passport.currentVitals.bloodSugar,
        spo2: currentVitals.spo2 || passport.currentVitals.spo2,
        temperature: currentVitals.temperature || passport.currentVitals.temperature,
        recordedBy: req.user.name + ' (Patient Self-Report)',
      });
    }

    await passport.save();
    res.json({ success: true, message: 'Health Passport updated successfully.', passport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/passport/refresh-qr
// @desc    Regenerate a fresh secure QR code
router.post('/refresh-qr', protect, async (req, res) => {
  try {
    const passport = await HealthPassport.findOne({ userId: req.user._id });
    if (!passport) {
      return res.status(404).json({ success: false, message: 'Passport not found.' });
    }

    const newPassportToken = `QHP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { qrDataUrl } = await generatePassportQRCode(req.user._id, passport.abhaId, newPassportToken);

    passport.passportToken = newPassportToken;
    passport.qrCodeDataUrl = qrDataUrl;
    await passport.save();

    res.json({ success: true, message: 'Fresh QR Code generated.', passport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/passport/public/:passportToken
// @desc    Emergency First-Responder view (NO login required, returns life-saving emergency medical summary)
router.get('/public/:passportToken', async (req, res) => {
  try {
    const passport = await HealthPassport.findOne({ passportToken: req.params.passportToken }).populate('userId', 'name phone');
    if (!passport) {
      return res.status(404).json({ success: false, message: 'Emergency QR code expired or invalid.' });
    }

    // Return only non-sensitive emergency critical data
    res.json({
      success: true,
      emergencyRecord: {
        patientName: passport.userId?.name || 'Emergency Patient',
        abhaId: passport.abhaId,
        bloodGroup: passport.bloodGroup,
        criticalAllergies: passport.allergies.filter(a => a.severity.includes('Severe')),
        chronicConditions: passport.chronicConditions,
        emergencyContact: passport.emergencyContact,
        organDonor: passport.organDonor,
        lastKnownVitals: passport.currentVitals,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
