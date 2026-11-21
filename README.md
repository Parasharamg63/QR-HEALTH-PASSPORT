# QR HEALTH PASSPORT 🏥

> **HealthTech Platform for Seamless, Consent-Governed Medical History & Treatment Management**  
> Built strictly using the **MERN Stack** (MongoDB, Express, React, Node.js) with independent backend and frontend architectures.  
> GitHub Repository: [https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git](https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git)

---

## 🌟 The Core Workflow (Prompt-Driven Architecture)

1. **Patient Registration & QR Generation**:
   - A patient registers on the platform.
   - The platform automatically creates a unique **ABHA Digital Health Passport** and issues a dynamic, personal **QR Code** upon registration.
2. **Doctor Visit & QR Code Presentation**:
   - The patient visits the doctor or clinic and presents their personal QR code (on their phone or as a printed badge).
3. **Doctor QR Code Scanning**:
   - The doctor scans the patient's QR code using their device camera or image scanner.
4. **Consent Handshake**:
   - The system triggers an instant patient consent verification.
   - The doctor **CANNOT access** confidential medical records until the patient explicitly authorizes the request using their **4-digit Security PIN (`1234`)**.
5. **Medical History Decryption**:
   - Once consent is verified, the doctor's screen unlocks the patient's complete chronological medical history (past diagnoses, previous doctor notes, active prescriptions, and allergies).
6. **Treatment & Medical History Update**:
   - The doctor conducts the clinical consultation, enters Chief Complaints, Diagnosis, Clinical Observations, and Prescribed Treatments.
   - Upon submission, the patient's **medical history is immutably updated** in the database and visible in real time on both doctor and patient views.

---

## 📋 The 6 Structured Phases

| Phase | Milestone | Key Features | Status |
|---|---|---|---|
| **Phase 1** | **Project Architecture & MERN Foundation** | Express API, MongoDB setup, Mongoose schemas, JWT Authentication, Clinical seed data | ✅ Pushed (`136b721`) |
| **Phase 2** | **Patient Registration & QR Code Generation** | Automatic ABHA ID generation, Dynamic cryptographic QR creation, Printable Digital Health Card | ✅ Pushed (`6a22dab`) |
| **Phase 3** | **Doctor Portal & QR Scanner Handshake** | Camera QR scanner, image upload scanner, manual ABHA lookup, Doctor consultation portal | ✅ Pushed (`44474ac`) |
| **Phase 4** | **Patient Real-Time Consent Verification** | Zero-knowledge consent handshake, 4-digit PIN verification (`1234`), 60-min access grant | 🟡 Ready for Next Push |
| **Phase 5** | **Doctor Treatment & Medical History Update** | Clinical consultation form, vital signs logging, prescription orders, real-time medical ledger update | 🟡 Ready for Next Push |
| **Phase 6** | **Production Polish & Clinical Verification** | Printable clinical summaries, multi-role testing, end-to-end audit trail, responsive UI | 🟡 Ready for Next Push |

---

## 👥 Built-in Realistic Demo Personas (1-Click Switcher)

| Role | Name | Email | Details |
|---|---|---|---|
| **Patient** | Rameshwar Gowda | `rameshwar.gowda@patient.org` | 68-year-old patient, ABHA: `91-4421-8890-1204`, Blood Group: `B+`, PIN: `1234` |
| **Doctor** | Dr. Rajesh Sharma, MD, DM | `doctor.rajesh@hospital.org` | Chief Consultant Cardiologist, Apex Heart & Super-Specialty Institute |

---

## 🚀 Running the WebApp

```bash
# 1. Start MongoDB
mongod --dbpath <data_directory> --port 27017

# 2. Run Backend (Port 5000)
cd backend
npm install
node seed/seedData.js
npm start

# 3. Run Frontend (Port 5173)
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.
