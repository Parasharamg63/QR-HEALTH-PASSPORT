# QR HEALTH PASSPORT 🏥

> **Consent-Governed HealthTech Platform for Seamless Medical History & Treatment Management**  
> Built strictly using the **MERN Stack** (MongoDB, Express, React, Node.js) with independent backend and frontend architectures.  
> GitHub Repository: [https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git](https://github.com/Parasharamg63/QR-HEALTH-PASSPORT.git)  
> Collaborators: `srushtimamatha10@gmail.com`, `thrupthis022@gmail.com`  
> Active Branches: `main` & `dev`

---

## 🎨 Dribbble-Inspired MedTech Design System

The application features a modern, luxury MedTech aesthetic inspired by top Dribbble healthtech designs:
- **Biometric Titanium Health Card**: Apple Wallet / Singpass style metallic card with holographic shimmer, gold EMV biometric chip, verified clinical status badges, and 1-click Health ID copy.
- **Dynamic QR Code Token**: High-contrast QR display with luminous corner brackets, dynamic token refresh, and instant physical print layout.
- **Clinical EHR Treatment Studio**: High-efficiency doctor workstation with visual telemetry cards for Vitals (BP, Pulse, SpO2, Glucose, Temp), diagnosis with ICD-10 tags, and an interactive medication prescription pad with instant dosage/meal-timing controls.
- **Chronological Clinical Ledger**: Visual medical history timeline featuring verified doctor signatures, diagnostic tags, and vitals history at each visit.
- **Cyberpunk Optical QR Scanner**: Dark viewfinder with an animated sweeping laser scan line and 1-click simulator test chips.
- **Cryptographic Consent Handshake**: 4-digit PIN verification modal enforcing time-bounded (60-minute) zero-knowledge data decryption.

---

## 🌟 The Core Clinical Workflow

1. **Patient Registration & QR Generation**:
   - Patient registers with basic demographics and emergency contact.
   - The platform automatically issues a unique **Universal Health ID (UHID)** (`91-XXXX-XXXX-XXXX`) and generates a personal dynamic **QR Code**.
2. **Doctor Visit & QR Code Presentation**:
   - Patient presents their personal QR code (on mobile screen or printed physical passport).
3. **Doctor QR Code Scanning**:
   - Doctor scans the QR code via webcam or runs a 1-click test simulation.
4. **Consent Handshake**:
   - Patient authorization is required. Confidential medical records remain encrypted until the patient authorizes the request using their **4-digit Security PIN (`1234`)**.
5. **Medical History Decryption**:
   - Upon verification, the doctor's screen unlocks the patient's complete chronological clinical history (past diagnoses, doctor notes, vitals, prescriptions, and allergies).
6. **Treatment & Ledger Update**:
   - Doctor enters clinical examination notes, vitals, diagnosis, and prescribed medications, then clicks **"Give Treatment & Update Medical History"**.
   - The record is immutably committed to the MongoDB ledger, and passport vitals are updated in real time.

---

## 📋 Structured Implementation Phases

| Phase | Milestone | Description | Status |
|---|---|---|---|
| **Phase 1** | **Project Architecture & MERN Foundation** | Express API, MongoDB setup, Mongoose schemas, JWT Authentication, Clinical seed data | ✅ Completed & Pushed |
| **Phase 2** | **Patient Registration & QR Code Generation** | Automatic Universal Health ID generation, Dynamic cryptographic QR creation, Printable Digital Health Card | ✅ Completed & Pushed |
| **Phase 3** | **Doctor Portal & QR Scanner Handshake** | Camera QR scanner, image upload scanner, manual Health ID lookup, Doctor consultation portal | ✅ Completed & Pushed |
| **Phase 4** | **Patient Real-Time Consent Verification** | Zero-knowledge consent handshake, 4-digit PIN verification (`1234`), 60-min access grant | ✅ Completed & Pushed |
| **Phase 5** | **Doctor Treatment & Medical History Update** | Clinical consultation form, vital signs logging, prescription orders, real-time medical ledger update | ✅ Completed & Pushed |
| **Phase 6** | **Dribbble MedTech Polish & Production Build** | Dribbble UI system, standard Login/Logout JWT auth, responsive layout, full verification | ✅ Completed & Pushed |

---

## 👥 Built-in Realistic Demo Personas (1-Click Fill)

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Patient** | Rameshwar Gowda | `rameshwar.gowda@patient.org` | `password123` | 68-year-old patient, Health ID: `91-4421-8890-1204`, Blood Group: `B+`, PIN: `1234` |
| **Doctor** | Dr. Rajesh Sharma, MD, DM | `doctor.rajesh@hospital.org` | `password123` | Consultant Cardiologist, Apex Heart & Super-Specialty Institute |

---

## 🚀 Running the WebApp Locally

### 1-Click Launch:
Double-click `start-dev.bat` in the repository root.

### Manual Launch:
```bash
# 1. Start MongoDB Server
mongod --dbpath "D:\QR HEALTH PASSPORT\data\db" --port 27017

# 2. Run Backend API (Port 5000)
cd backend
npm install
node seed/seedData.js
npm start

# 3. Run Frontend (Port 5173)
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser to experience the platform.
