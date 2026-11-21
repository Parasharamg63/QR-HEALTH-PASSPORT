const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HealthPassport = require('../models/HealthPassport');
const { generatePassportQRCode } = require('../services/qrService');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user (Patient, Doctor)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, language, doctorDetails, bloodGroup, dob, gender, emergencyContact } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      language: language || 'en',
      doctorDetails: role === 'doctor' ? doctorDetails : undefined,
    });

    // If registering as a patient, automatically provision their Health Passport & personal QR code
    let passport = null;
    if (user.role === 'patient') {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const abhaId = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${randomDigits}`;
      const passportToken = `QHP-${Date.now()}-${randomDigits}`;

      const { qrDataUrl } = await generatePassportQRCode(user._id, abhaId, passportToken);

      passport = await HealthPassport.create({
        userId: user._id,
        abhaId,
        passportToken,
        qrCodeDataUrl: qrDataUrl,
        bloodGroup: bloodGroup || 'O+',
        dob: dob || new Date('1990-01-01'),
        gender: gender || 'Other',
        emergencyContact: emergencyContact || {
          name: 'Primary Contact',
          relation: 'Family',
          phone: phone || '+91 98765 43210',
        },
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        phone: user.phone,
        doctorDetails: user.doctorDetails,
      },
      passport,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let passport = null;
    if (user.role === 'patient') {
      passport = await HealthPassport.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        phone: user.phone,
        doctorDetails: user.doctorDetails,
      },
      passport,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    let passport = null;
    if (req.user.role === 'patient') {
      passport = await HealthPassport.findOne({ userId: req.user._id });
    }
    res.json({
      success: true,
      user: req.user,
      passport,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
