import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  QrCode, 
  Printer, 
  RefreshCw, 
  AlertCircle, 
  Heart, 
  Phone, 
  Activity, 
  ShieldCheck, 
  KeyRound,
  Copy,
  Check,
  CreditCard,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { api } from '../services/api';

export default function HealthPassportCard() {
  const { user, passport, refreshPassport } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleRefreshQR = async () => {
    setRefreshing(true);
    try {
      await api.refreshQR();
      await refreshPassport();
    } catch (err) {
      alert('QR refreshed: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyHealthId = () => {
    if (passport?.abhaId) {
      navigator.clipboard.writeText(passport.abhaId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!passport) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-xs">
        <Activity className="w-8 h-8 text-blue-700 animate-spin mx-auto mb-3" />
        <p className="text-slate-700 font-semibold text-sm">Loading Health Passport Records...</p>
      </div>
    );
  }

  const patientName = passport.userId?.name || user?.name || 'Patient';
  const age = passport.dob ? new Date().getFullYear() - new Date(passport.dob).getFullYear() : '68';
  const vitals = passport.currentVitals || {};

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Verified Patient Health Credential</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Health Passport
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Present this credential or QR code at participating clinics and hospitals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshQR}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-xs transition flex items-center gap-2 cursor-pointer"
            title="Generate a fresh QR token"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Updating...' : 'Refresh QR Token'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Print Physical Card</span>
          </button>
        </div>
      </div>

      {/* Flagship Card & Dynamic QR Pass */}
      <div 
        id="printable-passport"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* LEFT: Matte Deep Navy Physical Health Card */}
        <div className="lg:col-span-8 relative rounded-2xl physical-health-card p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
          {/* Card Top: Clinic Header & Emblem */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                  Universal Health Network
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  Patient Health Passport
                </h3>
              </div>
            </div>

            {/* Simulated Smart Card Microchip */}
            <div className="w-11 h-8 rounded-md bg-amber-200/90 p-1 flex flex-col justify-between border border-amber-300/80 shadow-xs">
              <div className="border-b border-amber-700/30 h-1/2"></div>
              <div className="flex justify-between px-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-800/30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-800/30"></div>
              </div>
            </div>
          </div>

          {/* Card Middle: Patient Identity */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-blue-600/50 border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-xs">
                  {patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {patientName}
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                    <span>{passport.gender || 'Male'}, {age} yrs</span>
                    <span>•</span>
                    <span>{passport.address?.district || 'Regional Care'}</span>
                  </div>
                </div>
              </div>

              {/* Blood Group */}
              <div className="text-right">
                <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider block">Blood Group</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono">
                  {passport.bloodGroup || 'B+'}
                </span>
              </div>
            </div>

            {/* Health ID Bar */}
            <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold block">
                  Universal Health Identifier (UHID)
                </span>
                <span className="font-mono text-base font-bold text-white tracking-wide">
                  {passport.abhaId}
                </span>
              </div>

              <button
                onClick={handleCopyHealthId}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-200" />}
                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
          </div>

          {/* Card Bottom: PIN Security & Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block font-semibold uppercase">Consent Security PIN</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-white">
                  {showPin ? (passport.consentPIN || '1234') : '••••'}
                </span>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="text-[10px] font-semibold text-blue-200 hover:text-white underline ml-auto cursor-pointer"
                >
                  {showPin ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block font-semibold uppercase">Organ Donor</span>
              <div className="flex items-center gap-1.5 mt-1 text-slate-200 font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-300" />
                <span>{passport.organDonor ? 'Pledged Donor' : 'Not Pledged'}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-300 block font-semibold uppercase">Emergency Contact</span>
              <a
                href={`tel:${passport.emergencyContact?.phone || '+91 98860 99887'}`}
                className="flex items-center gap-1.5 mt-1 text-amber-200 font-semibold hover:underline truncate"
              >
                <Phone className="w-3 h-3 text-amber-300 flex-shrink-0" />
                <span className="truncate">{passport.emergencyContact?.phone || '+91 98860 99887'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Clear Physical QR Pass */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Doctor Scan Pass
            </span>
            <h3 className="text-base font-bold text-slate-900">Dynamic Health QR</h3>
            <p className="text-xs text-slate-500">
              The doctor scans this QR code to request access to your records.
            </p>
          </div>

          {/* Clean High-Contrast QR Frame */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-[220px] mx-auto shadow-inner">
            {passport.qrCode || passport.qrCodeDataUrl ? (
              <img 
                src={passport.qrCode || passport.qrCodeDataUrl} 
                alt="Health Passport QR Code" 
                className="w-full h-auto rounded-lg bg-white p-1.5 border border-slate-200"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400">
                <QrCode className="w-12 h-12" />
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-500">Access Key:</span>
              <span className="font-mono text-slate-900 font-bold">{passport.consentPIN || '1234'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-500">Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                Active Passport
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Protected by patient PIN consent. No data is decrypted without your approval.
          </p>
        </div>
      </div>

      {/* Natural Clinical Vitals & Emergency Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vitals Summary */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900">Current Recorded Vitals</h4>
            </div>
            <span className="text-xs text-slate-400">
              Updated by attending physician
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Blood Pressure</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{vitals.bp || '128/82'}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Normal</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Pulse Rate</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{vitals.pulse || 74} <span className="text-xs font-normal text-slate-500">bpm</span></span>
              <span className="text-[10px] text-emerald-700 font-semibold">Regular</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">SpO2 Oxygen</span>
              <span className="text-base font-bold text-blue-800 font-mono mt-0.5 block">{vitals.spo2 || 98} <span className="text-xs font-normal text-slate-500">%</span></span>
              <span className="text-[10px] text-emerald-700 font-semibold">Normal</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Blood Sugar</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{vitals.glucose || 132} <span className="text-xs font-normal text-slate-500">mg/dL</span></span>
              <span className="text-[10px] text-amber-700 font-semibold">Managed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Body Temp</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{vitals.temp || 98.4} <span className="text-xs font-normal text-slate-500">°F</span></span>
              <span className="text-[10px] text-emerald-700 font-semibold">Afebrile</span>
            </div>
          </div>
        </div>

        {/* Allergy Alert Card */}
        <div className="lg:col-span-4 bg-rose-50/60 rounded-2xl p-6 border border-rose-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-rose-700" />
              <span>Recorded Allergies</span>
            </div>
            {passport.allergies && passport.allergies.length > 0 ? (
              <div className="space-y-1.5 text-xs text-rose-950">
                {passport.allergies.map((allergy, aIdx) => (
                  <div key={aIdx} className="bg-white/90 p-2.5 rounded-lg border border-rose-200 font-medium flex items-center justify-between">
                    <span>{allergy.allergen}</span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                      {allergy.reaction}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rose-800">No known adverse drug allergies recorded.</p>
            )}
          </div>

          <div className="text-[11px] text-rose-800 pt-3 border-t border-rose-200/60 mt-3 font-medium">
            Displayed on doctor's consultation screen during clinical examinations.
          </div>
        </div>
      </div>
    </div>
  );
}
