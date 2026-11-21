import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import HealthPassportCard from './components/HealthPassportCard';
import MedicalHistoryTimeline from './components/MedicalHistoryTimeline';
import DoctorConsultationForm from './components/DoctorConsultationForm';
import QRScannerModal from './components/QRScannerModal';
import ConsentModal from './components/ConsentModal';
import ClinicalSummaryModal from './components/ClinicalSummaryModal';
import { useAuth } from './context/AuthContext';
import { 
  QrCode, 
  Stethoscope, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const { user, passport, refreshPassport, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('passport');

  // Modals
  const [showScanner, setShowScanner] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [summaryRecord, setSummaryRecord] = useState(null);

  // Doctor Consultation State
  const [activeSession, setActiveSession] = useState(null);
  const [patientPreview, setPatientPreview] = useState(null);
  const [consultationDossier, setConsultationDossier] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Auto-switch tab based on user role
  useEffect(() => {
    if (user?.role === 'doctor') {
      setActiveTab('doctorPortal');
    } else {
      setActiveTab('passport');
    }
  }, [user?.role]);

  // Load patient medical records
  const loadPatientRecords = async () => {
    const patientId = passport?.userId?._id || user?.id || user?._id;
    if (patientId) {
      try {
        const res = await api.getMedicalRecords(patientId);
        if (res.success) {
          setMedicalRecords(res.records || []);
          setPrescriptions(res.prescriptions || []);
        }
      } catch (err) {
        console.error('Failed to load patient records:', err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadPatientRecords();
    }
  }, [user, passport]);

  // Doctor Scans QR
  const handleScanSuccess = (scanResult) => {
    setPatientPreview(scanResult.patientPreview);
    setActiveSession({
      sessionId: scanResult.sessionId,
      sessionToken: scanResult.sessionToken,
    });
    setShowConsentModal(true);
  };

  // Patient Grants Consent
  const handleConsentGranted = async (grantedSession) => {
    setActiveSession(grantedSession);
    try {
      const patientId = patientPreview?.id || patientPreview?._id;
      const dossier = await api.getPatientDossier(patientId, grantedSession._id || grantedSession.id);
      if (dossier.success) {
        setConsultationDossier(dossier);
      }
    } catch (err) {
      alert('Error unlocking patient records: ' + err.message);
    }
  };

  // If loading auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Initializing Secure Health Passport Session...
          </p>
        </div>
      </div>
    );
  }

  // If NOT logged in, show normal Login / Register page
  if (!user) {
    return <LoginPage />;
  }

  const isDoctor = user.role === 'doctor';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* PATIENT VIEW: Tab 1 - Health Passport & QR Code */}
        {!isDoctor && activeTab === 'passport' && (
          <div className="space-y-6">
            <HealthPassportCard />

            {/* Quick Visit Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <h4 className="text-base font-extrabold text-slate-950">Visiting a Doctor or Hospital?</h4>
                </div>
                <p className="text-xs text-slate-500 font-medium max-w-2xl">
                  Display your digital QR code to the doctor. When they scan it, you will be prompted for your 4-digit PIN (default <strong className="text-slate-800 font-mono">1234</strong>) to grant 60-minute encrypted access.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md shadow-slate-900/10 transition flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Medical Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </button>
            </div>
          </div>
        )}

        {/* PATIENT VIEW: Tab 2 - Medical History Ledger */}
        {!isDoctor && activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Patient Medical Dossier
                </span>
                <h3 className="text-xl font-black text-slate-950 tracking-tight mt-1">
                  Complete Medical History for {user.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Every doctor consultation, diagnosis, vitals check, and prescription is immutably logged below.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('passport')}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition shadow-xs cursor-pointer"
              >
                ← Back to QR Passport
              </button>
            </div>

            <MedicalHistoryTimeline 
              records={medicalRecords} 
              prescriptions={prescriptions} 
            />
          </div>
        )}

        {/* DOCTOR VIEW: Tab 3 - Doctor Clinical Portal */}
        {isDoctor && (
          <div className="space-y-6">
            {!consultationDossier ? (
              /* Doctor Scan Prompt Hero Card */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xl space-y-7 relative overflow-hidden">
                {/* Ambient glow in card */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/25 text-white">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <div className="absolute top-0 right-1/2 translate-x-12 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Clinical Workflow Engine
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    Doctor Clinical QR Scanner
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
                    When the patient arrives, scan their Health Passport QR code. Once the patient approves the 4-digit PIN consent handshake, their complete medical ledger unlocks instantly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm sm:text-base shadow-xl shadow-teal-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Scan Patient QR Code</span>
                  </button>

                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    Manual Health ID Lookup
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2.5 max-w-xl mx-auto">
                  <Lock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="font-medium">
                    Consent-Governed Security: Decryption keys are issued only after explicit patient consent handshake.
                  </span>
                </div>
              </div>
            ) : (
              /* Doctor Consultation Workspace (Unlocked after Consent) */
              <div className="space-y-6">
                {/* Active Patient Dossier Header Banner */}
                <div className="bg-white rounded-3xl border-2 border-teal-500/40 p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                      {consultationDossier.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Consent Handshake Verified (60m)
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          Health ID: {consultationDossier.passport?.abhaId}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                        {consultationDossier.patient?.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Blood Group: <strong className="text-rose-600 font-black">{consultationDossier.passport?.bloodGroup}</strong> • 
                        Allergies: <strong className="text-rose-700 font-bold">{consultationDossier.passport?.allergies?.map(a => a.allergen).join(', ') || 'No known drug allergies'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setConsultationDossier(null)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition shadow-xs cursor-pointer"
                    >
                      Close Consultation
                    </button>
                    <button
                      onClick={() => setShowScanner(true)}
                      className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-md shadow-teal-600/20 cursor-pointer"
                    >
                      Scan Next Patient
                    </button>
                  </div>
                </div>

                {/* Doctor Treatment Form: Give Treatment & Update Medical History */}
                <DoctorConsultationForm
                  patient={consultationDossier.patient}
                  sessionId={activeSession?.sessionId || activeSession?._id}
                  onTreatmentSaved={async () => {
                    await refreshPassport();
                    await loadPatientRecords();
                    // Reload dossier to show updated records immediately
                    const updated = await api.getPatientDossier(consultationDossier.patient._id, activeSession?.sessionId);
                    if (updated.success) {
                      setConsultationDossier(updated);
                      if (updated.medicalHistory && updated.medicalHistory.length > 0) {
                        setSummaryRecord(updated.medicalHistory[0]);
                      }
                    }
                  }}
                />

                {/* Patient's Full Medical History (Unlocked with Consent) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h4 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      Patient's Historical Clinical Dossier
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Unlocked with Patient Consent
                    </span>
                  </div>

                  <MedicalHistoryTimeline
                    records={consultationDossier.medicalHistory || []}
                    prescriptions={consultationDossier.prescriptions || []}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="font-black text-slate-800">QR Health Passport</span>
            <span>• Built on MERN Stack</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Smart Patient-Centric Healthcare • Consent-Governed Medical History Synchronization
          </p>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Consent Authorization Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        sessionId={activeSession?.sessionId}
        patientPreview={patientPreview}
        onClose={() => setShowConsentModal(false)}
        onConsentGranted={handleConsentGranted}
      />

      {/* Clinical Consultation Summary Modal */}
      <ClinicalSummaryModal
        isOpen={!!summaryRecord}
        record={summaryRecord}
        patient={consultationDossier?.patient}
        onClose={() => setSummaryRecord(null)}
      />
    </div>
  );
}
