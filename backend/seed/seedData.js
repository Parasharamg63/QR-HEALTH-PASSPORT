const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthPassport = require('../models/HealthPassport');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const CaregiverAlert = require('../models/CaregiverAlert');
const DoseLog = require('../models/DoseLog');
const { generatePassportQRCode } = require('../services/qrService');

const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

async function seedDatabase() {
  console.log('[Seed] Initializing Realistic HealthTech Database Seed...');

  // Clear existing collections safely
  await User.deleteMany({});
  await HealthPassport.deleteMany({});
  await MedicalRecord.deleteMany({});
  await Prescription.deleteMany({});
  await CaregiverAlert.deleteMany({});
  await DoseLog.deleteMany({});

  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Create Doctors
  const doctorRajesh = await User.create({
    name: 'Dr. Rajesh Sharma, MD, DM',
    email: 'doctor.rajesh@hospital.org',
    password: hashedPassword,
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
    password: hashedPassword,
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
    password: hashedPassword,
    role: 'patient',
    phone: '+91 94480 33211',
    language: 'kn', // Kannada native
    isDemoUser: true,
  });

  const patientPriya = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@patient.org',
    password: hashedPassword,
    role: 'patient',
    phone: '+91 99012 88776',
    language: 'en',
    isDemoUser: true,
  });

  // 3. Create Caregiver (Suresh Gowda - son of Rameshwar)
  const caregiverSuresh = await User.create({
    name: 'Suresh Gowda',
    email: 'caregiver.suresh@care.org',
    password: hashedPassword,
    role: 'caregiver',
    phone: '+91 98860 99887',
    language: 'kn',
    caregiverDetails: {
      patientRelation: 'Son & Primary Caregiver',
      assignedPatientId: patientRameshwar._id,
      notificationsEnabled: true,
    },
    isDemoUser: true,
  });

  // 4. Create Health Passports
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
      { name: 'Mild Diabetic Peripheral Neuropathy', diagnosedYear: 2022, severity: 'Mild', notes: 'Tingling in lower extremities' },
    ],
    allergies: [
      { allergen: 'Sulfa Drugs (Sulfonamides)', reaction: 'Severe maculopapular cutaneous rash & urticaria', severity: 'Severe / Life Threatening' },
      { allergen: 'Dust & Pollen', reaction: 'Allergic rhinitis & sneezing', severity: 'Mild' },
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
      { name: 'Moderate Persistent Bronchial Asthma', diagnosedYear: 2020, severity: 'Moderate', notes: 'Triggered by seasonal cold & pollution' },
    ],
    allergies: [
      { allergen: 'Penicillin / Amoxicillin', reaction: 'Anaphylactoid reaction, facial edema, bronchospasm', severity: 'Severe / Life Threatening' },
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

  // 5. Create Realistic Clinical Records for Rameshwar Gowda
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
    investigationsOrdered: ['HbA1c (Current: 7.2%)', 'Serum Creatinine: 1.0 mg/dL', 'Lipid Panel', 'Urine Microalbumin: Negative'],
    treatmentPlan: 'Reinforce low-glycemic, low-sodium diabetic diet. Continue daily 30-minute brisk walk. Maintain strict timing between morning antidiabetic and breakfast.',
    followUpDate: new Date(Date.now() + 65 * 86400000),
  });

  // 6. Create Active Prescription for Rameshwar Gowda
  const rxRameshwar = await Prescription.create({
    patientId: patientRameshwar._id,
    doctorId: doctorAnanya._id,
    doctorName: doctorAnanya.name,
    hospitalName: doctorAnanya.doctorDetails.hospital,
    recordId: record1._id,
    diagnosis: 'Type 2 Diabetes Mellitus & Hypertension',
    medicines: [
      {
        name: 'Metformin Sustained Release',
        genericName: 'Metformin HCl SR',
        category: 'Antidiabetic',
        dosage: '500 mg',
        form: 'Tablet',
        frequency: 'Twice Daily (1-0-1)',
        mealTiming: 'After Food',
        timingSlots: [
          { slot: 'Morning', timeString: '08:30 AM' },
          { slot: 'Night', timeString: '09:00 PM' },
        ],
        durationDays: 60,
        instructions: 'Take immediately after morning and night meals with water.',
        instructionsLocal: {
          hi: 'सुबह और रात के खाने के तुरंत बाद पानी के साथ लें।',
          kn: 'ಬೆಳಗಿನ ಉಪಹಾರ ಮತ್ತು ರಾತ್ರಿಯ ಊಟದ ನಂತರ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
        },
      },
      {
        name: 'Telmisartan Tablets IP',
        genericName: 'Telmisartan',
        category: 'Antihypertensive',
        dosage: '40 mg',
        form: 'Tablet',
        frequency: 'Once Daily (1-0-0)',
        mealTiming: 'After Food',
        timingSlots: [
          { slot: 'Morning', timeString: '09:00 AM' },
        ],
        durationDays: 60,
        instructions: 'Take once daily in the morning for blood pressure control.',
        instructionsLocal: {
          hi: 'रक्तचाप नियंत्रण के लिए सुबह एक बार लें।',
          kn: 'ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ದಿನಕ್ಕೆ ಒಮ್ಮೆ ಬೆಳಗ್ಗೆ ಸೇವಿಸಿ.',
        },
      },
      {
        name: 'Atorvastatin Tablets IP',
        genericName: 'Atorvastatin Calcium',
        category: 'Cardiovascular',
        dosage: '10 mg',
        form: 'Tablet',
        frequency: 'Once Daily (0-0-0-1)',
        mealTiming: 'Bedtime (Night)',
        timingSlots: [
          { slot: 'Night', timeString: '09:30 PM' },
        ],
        durationDays: 60,
        instructions: 'Take at night before sleep for lipid / cholesterol protection.',
        instructionsLocal: {
          hi: 'कोलेस्ट्रॉल नियंत्रण के लिए सोने से पहले रात में लें।',
          kn: 'ಕೊಲೆಸ್ಟ್ರಾಲ್ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ಸೇವಿಸಿ.',
        },
      },
    ],
    clashWarnings: [],
    status: 'Active',
    prescribedDate: new Date(Date.now() - 25 * 86400000),
    validUntil: new Date(Date.now() + 65 * 86400000),
  });

  // 7. Seed Past 7 Days Dose Logs for Rameshwar (Adherence Tracking & Streaks)
  for (let i = 6; i >= 0; i--) {
    const dateStr = getPastDateStr(i);
    // Morning Metformin
    await DoseLog.create({
      patientId: patientRameshwar._id,
      prescriptionId: rxRameshwar._id,
      medicineName: 'Metformin Sustained Release',
      dosage: '500 mg',
      date: dateStr,
      slot: 'Morning',
      scheduledTimeString: '08:30 AM',
      status: 'TAKEN',
      takenAt: new Date(`${dateStr}T08:35:00Z`),
      markedBy: 'PATIENT',
    });

    // Morning Telmisartan
    await DoseLog.create({
      patientId: patientRameshwar._id,
      prescriptionId: rxRameshwar._id,
      medicineName: 'Telmisartan Tablets IP',
      dosage: '40 mg',
      date: dateStr,
      slot: 'Morning',
      scheduledTimeString: '09:00 AM',
      status: 'TAKEN',
      takenAt: new Date(`${dateStr}T09:05:00Z`),
      markedBy: 'PATIENT',
    });

    // Night Metformin (Make 2 days ago missed to simulate realistic missed dose & caregiver alert!)
    const nightStatus = i === 2 ? 'MISSED' : 'TAKEN';
    await DoseLog.create({
      patientId: patientRameshwar._id,
      prescriptionId: rxRameshwar._id,
      medicineName: 'Metformin Sustained Release',
      dosage: '500 mg',
      date: dateStr,
      slot: 'Night',
      scheduledTimeString: '09:00 PM',
      status: nightStatus,
      takenAt: nightStatus === 'TAKEN' ? new Date(`${dateStr}T21:10:00Z`) : null,
      markedBy: nightStatus === 'TAKEN' ? 'PATIENT' : 'SYSTEM_TIMEOUT',
    });

    // Night Atorvastatin
    await DoseLog.create({
      patientId: patientRameshwar._id,
      prescriptionId: rxRameshwar._id,
      medicineName: 'Atorvastatin Tablets IP',
      dosage: '10 mg',
      date: dateStr,
      slot: 'Night',
      scheduledTimeString: '09:30 PM',
      status: nightStatus,
      takenAt: nightStatus === 'TAKEN' ? new Date(`${dateStr}T21:35:00Z`) : null,
      markedBy: nightStatus === 'TAKEN' ? 'PATIENT' : 'SYSTEM_TIMEOUT',
    });
  }

  // 8. Seed Caregiver Alert for the Missed Dose
  await CaregiverAlert.create({
    patientId: patientRameshwar._id,
    patientName: patientRameshwar.name,
    caregiverId: caregiverSuresh._id,
    type: 'MISSED_DOSE',
    severity: 'HIGH',
    title: 'Missed Dose: Metformin & Atorvastatin',
    message: `${patientRameshwar.name} missed the scheduled Night medications on ${getPastDateStr(2)}. Automated check advised reminder call.`,
    metadata: {
      medicineName: 'Metformin & Atorvastatin',
      scheduledSlot: 'Night',
    },
    isResolved: false,
  });

  await CaregiverAlert.create({
    patientId: patientRameshwar._id,
    patientName: patientRameshwar.name,
    caregiverId: caregiverSuresh._id,
    type: 'APPOINTMENT_REMINDER',
    severity: 'INFO',
    title: 'Upcoming Glycemic Follow-up',
    message: `Scheduled quarterly HbA1c review with Dr. Ananya Iyer in 4 weeks.`,
    isResolved: false,
  });

  console.log('[Seed Completed] Created:');
  console.log(' - Doctors: Dr. Rajesh Sharma, Dr. Ananya Iyer');
  console.log(' - Patients: Rameshwar Gowda (ABHA: 91-4421-8890-1204), Priya Sharma');
  console.log(' - Caregiver: Suresh Gowda');
  console.log(' - Passports, Encounters, Prescriptions, Adherence Logs & Caregiver Alerts.');
}

// Allow standalone execution: node seed/seedData.js
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}

module.exports = seedDatabase;
