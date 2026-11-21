# QR HEALTH PASSPORT 🏥

> **Smart, Accessible & Patient-Centric Healthcare Platform**  
> Built with the **MERN Stack** (MongoDB, Express, React, Node.js) with clean backend and frontend separation.  
> GitHub Repository: [https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git](https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git)

---

## 🌟 Overview & Real-World Healthcare Impact
**QR Health Passport** is a real-world, clinical-grade healthtech web application engineered to solve critical healthcare challenges, particularly for rural populations, elderly patients, and families managing chronic diseases (diabetes, hypertension, cardiac care).

### The Real Problem
- Patients frequently miss critical medications or take conflicting drugs that cause dangerous drug-drug interactions.
- Warning signs and vital drops are discovered too late.
- When visiting a hospital or specialist, patients lack organized medical histories, leading to repeated tests, adverse drug reactions, and fragmented care.

### The Solution
1. **Dynamic Cryptographic QR Health Passport**: Every patient receives an ABHA-compliant Digital Health Passport with a secure dynamic QR code.
2. **Consent-Governed Doctor Access**: When visiting a doctor, scanning the QR code triggers a real-time consent handshake. Medical records are decrypted **only after explicit patient consent (PIN authorization)**.
3. **Clinical Consultation & Clash-Free Treatment**: Doctors review chronological medical history, record diagnoses/vitals, and prescribe medications through an automated **Drug Clash Detection Engine** (flags interactions, e.g. Warfarin + Ibuprofen, or patient allergies).
4. **Patient Medicine Planner & Audio Reminders**: Clash-free medication schedule organized into 4 daily slots (Morning, Afternoon, Evening, Night) with 1-click adherence logging and local-language audio reminders (Kannada, Hindi, English).
5. **Caregiver Alert Center**: Any missed dose immediately triggers an automated priority alert to designated family caregivers with 1-click WhatsApp and Phone call intervention.
6. **Safe & Responsible AI Assistant**: An educational health chatbot with strict safety guardrails that provides medication timing guidance without issuing clinical diagnoses.

---

## 🏗️ Architecture & Technology Stack

```
QR HEALTH PASSPORT
├── backend/                  # Node.js + Express + MongoDB REST API
│   ├── config/               # Database connection (Local MongoDB & Atlas)
│   ├── models/               # User, HealthPassport, MedicalRecord, Prescription, ConsentSession, DoseLog, CaregiverAlert
│   ├── routes/               # Auth, Passport, Doctor, Medical, Adherence, Alert endpoints
│   ├── services/             # Drug Clash Detector & QR Cryptographic Service
│   ├── seed/                 # Comprehensive clinical seed data (Rameshwar Gowda, Dr. Rajesh, Suresh Gowda)
│   └── server.js             # API entrypoint on port 5000
└── frontend/                 # React 18 + Vite + Tailwind CSS + Lucide Icons
    ├── src/
    │   ├── components/       # Digital Passport Card, QR Scanner, Consent Modal, Medicine Planner, etc.
    │   ├── context/          # AuthContext (1-click Demo Persona Switcher) & LanguageContext (EN/HI/KN)
    │   ├── services/         # API integration client
    │   ├── App.jsx           # Main clinical workflow orchestrator
    │   └── main.jsx          # Root mount
```

---

## 📋 The 6 Execution Phases

| Phase | Title | Key Deliverables | Status |
|---|---|---|---|
| **Phase 1** | **Foundation & Architecture** | Express API, MongoDB setup, Mongoose schemas, JWT Auth, Role-based Access, Demo accounts | ✅ Complete |
| **Phase 2** | **QR Health Passport & Digital ID** | ABHA ID formatting, dynamic QR generation, Emergency First-Responder view, Printable Card | ✅ Complete |
| **Phase 3** | **Consent Handshake & Doctor Scanner** | Camera-based QR scanner, file upload, patient 4-digit PIN verification, 60-min access grant | ✅ Complete |
| **Phase 4** | **Clinical Treatment & Clash Detector** | Doctor consultation form, vital signs recording, Drug-Drug Interaction engine, allergy checks | ✅ Complete |
| **Phase 5** | **Medicine Planner & Caregiver Alerts** | 4-slot daily planner, 1-click Taken/Missed actions, 7-day adherence charts, Caregiver SMS/Call portal | ✅ Complete |
| **Phase 6** | **Accessibility, AI Chatbot & Deployment** | Multi-language (English/Hindi/Kannada), Elder High-Contrast mode, Web Speech audio, Safe AI Assistant | ✅ Complete |

---

## 👥 Pre-Configured Demo Personas (1-Click Switcher)

| Role | Name | Email | Details |
|---|---|---|---|
| **Patient** | Rameshwar Gowda | `rameshwar.gowda@patient.org` | 68-year-old retired farmer, Type 2 Diabetes, Stage II Hypertension, Sulfa drug allergy |
| **Doctor** | Dr. Rajesh Sharma, MD, DM | `doctor.rajesh@hospital.org` | Chief Consultant Cardiologist, Apex Heart & Super-Specialty Institute |
| **Caregiver** | Suresh Gowda | `caregiver.suresh@care.org` | Son & primary caregiver, receives instant missed-dose and SOS alerts |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v25.1.0)
- **MongoDB**: Local MongoDB on port 27017 or MongoDB Atlas connection string

### 2. Backend Setup
```bash
cd backend
npm install
node seed/seedData.js   # Seeds realistic clinical encounters and demo accounts
npm start               # Runs Express backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Runs Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🛡️ Safety & Responsible AI Disclaimer
This web application provides medication organization, patient-controlled health record access, and educational information only. It **never issues autonomous medical diagnoses or unverified dosage adjustments**. In any medical emergency, users are instructed to dial **112** or visit the nearest healthcare facility.
author :team nishchaya
