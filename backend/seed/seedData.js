const mongoose = require('mongoose');
const User = require('../models/User');
const HealthPassport = require('../models/HealthPassport');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const { generatePassportQRCode } = require('../services/qrService');

async function seedDatabase() {
  console.log('[Seed] Initializing Realistic HealthTech Database Seed...');

  // Clear existing collections safely
  await User.deleteMany({});
  await HealthPassport.deleteMany({});
  await MedicalRecord.deleteMany({});
  await Prescription.deleteMany({});

  const defaultPassword = 'password123';

  // 1. Create Doctors
  const doctorRajesh = await User.create({
    name: 'Dr. Rajesh Sharma, MD, DM',
    email: 'doctor.rajesh@hospital.org',
    password: defaultPassword,
    role: 'doctor',
    phone: '+91 98450 11223',
    language: 'en',
    doctorDetails: {
      specialization: 'Chief Consultant Cardiologist',
      licenseNumber: 'KMC-48291-KA',
      hospital: 'Apex Heart & Super-Specialty Institute',
      department: 'Cardiology',
      experienceYears: 18,
    },
    isDemoUser: true,
  });

  const doctorAnanya = await User.create({
    name: 'Dr. Ananya Iyer, MD',
    email: 'doctor.ananya@hospital.org',
    password: defaultPassword,
    role: 'doctor',
    phone: '+91 98451 44556',
    language: 'en',
    doctorDetails: {
      specialization: 'Consultant Diabetologist & General Physician',
      licenseNumber: 'KMC-59210-KA',
      hospital: 'City Care Multispecialty Hospital',
      department: 'Internal Medicine',
      experienceYears: 12,
    },
    isDemoUser: true,
  });

  // 2. Create Patients
  const patientRameshwar = await User.create({
    name: 'Rameshwar Gowda',
    email: 'rameshwar.gowda@patient.org',
    password: defaultPassword,
    role: 'patient',
    phone: '+91 94480 33211',
    language: 'en',
    isDemoUser: true,
  });

  const patientPriya = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@patient.org',
    password: defaultPassword,
    role: 'patient',
    phone: '+91 99012 88776',
    language: 'en',
    isDemoUser: true,
  });

  // 3. Create Health Passports
  const abhaRameshwar = '91-4421-8890-1204';
  const tokenRameshwar = 'QHP-2026-RAMESHWAR-01';
  const qrRameshwar = await generatePassportQRCode(patientRameshwar._id, abhaRameshwar, tokenRameshwar);

  const passportRameshwar = await HealthPassport.create({
    userId: patientRameshwar._id,
    abhaId: abhaRameshwar,
    passportToken: tokenRameshwar,
    qrCodeDataUrl: qrRameshwar.qrDataUrl,
    bloodGroup: 'B+',
    dob: new Date('1958-06-15'),
    gender: 'Male',
    address: {
      villageOrCity: 'Mandya Rural',
      district: 'Mandya',
      state: 'Karnataka',
      pincode: '571401',
    },
    emergencyContact: {
      name: 'Suresh Gowda',
      relation: 'Son',
      phone: '+91 98860 99887',
      secondaryPhone: '+91 94480 33211',
    },
    chronicConditions: [
      { name: 'Type 2 Diabetes Mellitus (T2DM)', diagnosedYear: 2015, severity: 'Moderate', notes: 'Target HbA1c < 7.0%' },
      { name: 'Essential Hypertension (Stage II)', diagnosedYear: 2018, severity: 'Moderate', notes: 'Under regular ARB therapy' },
    ],
    allergies: [
      { allergen: 'Sulfa Drugs (Sulfonamides)', reaction: 'Severe maculopapular rash & urticaria', severity: 'Severe / Life Threatening' },
    ],
    organDonor: true,
    consentPIN: '1234',
    currentVitals: {
      bloodPressure: '130/84',
      heartRate: 74,
      bloodSugar: 138,
      spo2: 97,
      temperature: 98.4,
      weight: 67,
      height: 168,
      lastUpdated: new Date(),
    },
    vitalsHistory: [
      { bloodPressure: '142/90', heartRate: 78, bloodSugar: 165, spo2: 96, temperature: 98.6, recordedAt: new Date(Date.now() - 30 * 86400000), recordedBy: 'Dr. Ananya Iyer' },
      { bloodPressure: '136/88', heartRate: 75, bloodSugar: 148, spo2: 97, temperature: 98.4, recordedAt: new Date(Date.now() - 14 * 86400000), recordedBy: 'Dr. Ananya Iyer' },
      { bloodPressure: '130/84', heartRate: 74, bloodSugar: 138, spo2: 97, temperature: 98.4, recordedAt: new Date(), recordedBy: 'Dr. Rajesh Sharma' },
    ],
  });

  const abhaPriya = '91-3819-2041-9921';
  const tokenPriya = 'QHP-2026-PRIYA-02';
  const qrPriya = await generatePassportQRCode(patientPriya._id, abhaPriya, tokenPriya);

  await HealthPassport.create({
    userId: patientPriya._id,
    abhaId: abhaPriya,
    passportToken: tokenPriya,
    qrCodeDataUrl: qrPriya.qrDataUrl,
    bloodGroup: 'O+',
    dob: new Date('1998-04-20'),
    gender: 'Female',
    address: {
      villageOrCity: 'Indiranagar, Bangalore',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      pincode: '560038',
    },
    emergencyContact: {
      name: 'Sunil Sharma',
      relation: 'Brother',
      phone: '+91 99012 55443',
    },
    chronicConditions: [
      { name: 'Moderate Persistent Bronchial Asthma', diagnosedYear: 2020, severity: 'Moderate', notes: 'Seasonal trigger' },
    ],
    allergies: [
      { allergen: 'Penicillin / Amoxicillin', reaction: 'Anaphylactoid reaction, facial edema', severity: 'Severe / Life Threatening' },
    ],
    organDonor: false,
    consentPIN: '1234',
    currentVitals: {
      bloodPressure: '118/76',
      heartRate: 72,
      bloodSugar: 94,
      spo2: 99,
      temperature: 98.6,
      weight: 56,
      height: 162,
      lastUpdated: new Date(),
    },
  });

  // 4. Create Initial Clinical Record for Rameshwar Gowda
  const record1 = await MedicalRecord.create({
    patientId: patientRameshwar._id,
    doctorId: doctorAnanya._id,
    doctorName: doctorAnanya.name,
    doctorSpecialization: doctorAnanya.doctorDetails.specialization,
    hospitalName: doctorAnanya.doctorDetails.hospital,
    visitDate: new Date(Date.now() - 25 * 86400000),
    visitType: 'OPD',
    chiefComplaints: ['Postprandial lethargy', 'Occasional morning headache', 'Routine 3-month glycemic checkup'],
    diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension',
    icdCode: 'E11.9 / I10',
    clinicalObservations: 'Bilateral pedal pulses intact. No acute diabetic foot ulcers. Cardiovascular S1/S2 audible, no murmurs. Chest clear to auscultation.',
    vitalsRecorded: { bp: '136/88', pulse: 75, spo2: 97, temp: 98.4, glucose: 148 },
    investigationsOrdered: ['HbA1c (Current: 7.2%)', 'Serum Creatinine: 1.0 mg/dL', 'Lipid Panel'],
    treatmentPlan: 'Reinforce low-glycemic, low-sodium diabetic diet. Continue daily 30-minute brisk walk. Maintain strict timing between morning antidiabetic and breakfast.',
    followUpDate: new Date(Date.now() + 65 * 86400000),
  });

  // 5. Create Initial Prescription for Rameshwar Gowda
  await Prescription.create({
    patientId: patientRameshwar._id,
    doctorId: doctorAnanya._id,
    doctorName: doctorAnanya.name,
    hospitalName: doctorAnanya.doctorDetails.hospital,
    recordId: record1._id,
    diagnosis: 'Type 2 Diabetes Mellitus & Hypertension',
    medicines: [
      {
        name: 'Metformin Sustained Release',
        dosage: '500 mg',
        frequency: 'Twice Daily (1-0-1)',
        mealTiming: 'After Food',
        instructions: 'Take immediately after morning and night meals with water.',
      },
      {
        name: 'Telmisartan Tablets IP',
        dosage: '40 mg',
        frequency: 'Once Daily (1-0-0)',
        mealTiming: 'After Food',
        instructions: 'Take once daily in the morning for blood pressure control.',
      },
    ],
    status: 'Active',
    prescribedDate: new Date(Date.now() - 25 * 86400000),
    validUntil: new Date(Date.now() + 65 * 86400000),
  });

  console.log('[Seed Completed] Created:');
  console.log(' - Doctor: Dr. Rajesh Sharma (doctor.rajesh@hospital.org / password123)');
  console.log(' - Patient: Rameshwar Gowda (rameshwar.gowda@patient.org / password123, PIN: 1234)');
}

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}

module.exports = seedDatabase;
