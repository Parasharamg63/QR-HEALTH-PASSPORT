import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, X, AlertTriangle, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export default function ConsentModal({ isOpen, onClose, sessionId, patientPreview, onConsentGranted }) {
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGrant = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.grantConsent({ sessionId, pin });
      if (res.success) {
        onConsentGranted(res.session);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Consent authorization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-teal-500/40 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            FHIR Consent Handshake Protocol
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Authorize Clinical Data Access
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            <strong className="text-slate-800">Dr. Rajesh Sharma (Cardiologist)</strong> is requesting explicit patient consent to view medical records, past prescriptions, allergies, and record new diagnoses.
          </p>
        </div>

        {patientPreview && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mt-4 text-xs space-y-1">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Patient:</span>
              <span className="text-slate-900 font-bold">{patientPreview.name}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>ABHA ID:</span>
              <span className="font-mono text-slate-700">{patientPreview.abhaId}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Blood Group:</span>
              <span className="font-bold text-rose-600">{patientPreview.bloodGroup}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Access Expiry:</span>
              <span className="font-semibold text-teal-700">60 Minutes Window</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-teal-600" />
            Patient 4-Digit Security PIN (Default: 1234):
          </label>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="1234"
            className="w-full text-center tracking-[0.5em] font-mono text-xl py-2 px-4 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none font-bold"
          />
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Deny Access
          </button>
          <button
            onClick={handleGrant}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? 'Authorizing...' : 'Grant Access (60m)'}
          </button>
        </div>
      </div>
    </div>
  );
}
