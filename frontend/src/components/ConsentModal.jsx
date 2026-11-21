import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, X, AlertTriangle, KeyRound, ArrowRight, UserCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-teal-500/40 animate-in fade-in zoom-in duration-200 space-y-5">
        {/* Top Handshake Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>FHIR Consent Handshake Protocol</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight mt-1">
            Authorize Clinical Record Access
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
            <strong className="text-slate-900">Dr. Rajesh Sharma (Cardiologist)</strong> is requesting explicit consent to decrypt past clinical encounters, diagnostic reports, and record new treatment.
          </p>
        </div>

        {/* Patient Preview Card */}
        {patientPreview && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex justify-between items-center font-bold text-slate-800">
              <span className="text-slate-500 font-semibold">Patient:</span>
              <span className="text-slate-950 font-black">{patientPreview.name}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400 font-semibold">Health ID:</span>
              <span className="font-mono font-bold text-teal-800">{patientPreview.abhaId}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400 font-semibold">Blood Group:</span>
              <span className="font-black text-rose-600">{patientPreview.bloodGroup}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400 font-semibold">Access Scope:</span>
              <span className="font-bold text-emerald-600">60 Minutes Session (Ephemeral)</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Entry Studio */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              Patient 4-Digit Security PIN:
            </span>
            <button
              type="button"
              onClick={() => setPin('1234')}
              className="text-[11px] text-teal-600 hover:text-teal-700 font-bold underline"
            >
              Fill '1234'
            </button>
          </label>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="1234"
            className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 px-4 rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none font-black text-slate-900 bg-slate-50/50"
          />
          <p className="text-center text-[10px] text-slate-400 font-medium">
            The patient must verbally or physically authorize this PIN to decrypt records.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Deny Access
          </button>
          <button
            onClick={handleGrant}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-black shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? 'Authorizing...' : 'Grant Access (60m)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
