## 📌 Pull Request Overview

### 1. Summary of Changes
<!-- Provide a concise description of the motivation, changes introduced, or bug resolved -->

### 2. Clinical / Architectural Scope
- [ ] 🪪 **Patient Health Passport & Smart Card** (Vitals strip, dynamic QR token, allergies, emergency contacts)
- [ ] 🩺 **Doctor Clinical Consultation Form & Prescriptions** (Treatment pad, ICD-10 tags, dosage builder)
- [ ] 📷 **QR Code Scanner & Hardware Decoding** (Camera streams, 4-tier decoder, file upload, manual UHID)
- [ ] 🛡️ **Consent Security Handshake & PIN Protocol** (4-digit PIN verification, 60m ephemeral session)
- [ ] 🌐 **Multi-Language Localization (i18n)** (Kannada ಕನ್ನಡ, Hindi हिंदी, Telugu తెలుగు, English)
- [ ] 🎨 **Clinical UI & Theme System** (Color palettes, dark/light mode, mobile responsiveness)
- [ ] ⚙️ **Backend API & Mongoose Models** (Auth, JWT, RBAC, endpoints, database schema)
- [ ] 📝 **Documentation & Dev Tools** (README, launcher scripts, seed datasets)

---

### 3. Key Components Modified
| Component / File | Purpose of Change |
|---|---|
| `frontend/src/...` | |
| `backend/...` | |

---

### 4. Verification & Testing Checklist
- [ ] `cd frontend && npm run build` completed with `0 errors`.
- [ ] Backend server boots cleanly (`node server.js`) with MongoDB connected.
- [ ] Tested in Google Chrome / Microsoft Edge.
- [ ] Verified light and dark mode styling.
- [ ] Tested multi-language switching (English, Kannada, Hindi, Telugu) without page reload.
- [ ] Verified patient PIN consent handshake (`1234`) and time-bound expiration.
- [ ] Confirmed zero sensitive health records decrypted prior to patient PIN consent.

---

### 5. Visual Proof / Screenshots (Optional)
<!-- Please attach relevant screenshots, terminal outputs, or recordings if applicable -->

---

### 6. Reviewers
- Assigned Reviewers: @Parasharamg63
- Collaborators: `srushtimamatha10@gmail.com`, `thrupthis022@gmail.com`
