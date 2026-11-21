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
  Activity
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* PATIENT VIEW: Tab 1 - Health Passport & QR Code */}
        {!isDoctor && activeTab === 'passport' && (
          <div className="space-y-8">
            <HealthPassportCard />
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">Visiting a Doctor or Hospital?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Show your Health Passport QR code above. The doctor will scan it and request your consent to access your medical history.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                View Past Medical Visits →
              </button>
            </div>
          </div>
        )}

        {/* PATIENT VIEW: Tab 2 - Medical History Ledger */}
        {!isDoctor && activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
                  Patient Medical Dossier
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Complete Medical History for {user.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Every doctor consultation, diagnosis, and treatment plan is immutably logged below.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('passport')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
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
              /* Doctor Scan Prompt */
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner border border-teal-100">
                  <QrCode className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Doctor Clinical QR Scanner
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                    When the patient visits, scan their QR code to request consent. Upon approval, their complete medical history unlocks automatically.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Scan Patient QR Code</span>
                  </button>

                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Manual ABHA Lookup
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2 max-w-lg mx-auto">
                  <Lock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>
                    Consent-Governed Access: Doctor receives history only after patient approves with their 4-digit PIN.
                  </span>
                </div>
              </div>
            ) : (
              /* Doctor Consultation Workspace (Unlocked after Consent) */
              <div className="space-y-6">
                {/* Active Patient Dossier Header */}
                <div className="bg-white rounded-3xl border-2 border-teal-500/40 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-black">
                      {consultationDossier.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Patient Consent Granted (60m)
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          ABHA: {consultationDossier.passport?.abhaId}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {consultationDossier.patient?.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Blood Group: <strong className="text-rose-600">{consultationDossier.passport?.bloodGroup}</strong> • 
                        Allergies: <strong className="text-rose-700">{consultationDossier.passport?.allergies?.map(a => a.allergen).join(', ') || 'No known drug allergies'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConsultationDossier(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
                    >
                      Close Consultation
                    </button>
                    <button
                      onClick={() => setShowScanner(true)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs"
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      Patient's Historical Clinical Records
                    </h4>
                    <span className="text-xs font-semibold text-slate-500">
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
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-700">QR Health Passport</span>
            <span>• Built on MERN Stack</span>
          </div>
          <p className="text-[11px] text-slate-400">
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
