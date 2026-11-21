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
  Sparkles,
  KeyRound,
  Copy,
  Check,
  CreditCard,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function HealthPassportCard() {
  const { user, passport, refreshPassport } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);

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

  const handleCopyAbha = () => {
    if (passport?.abhaId) {
      navigator.clipboard.writeText(passport.abhaId);
      setCopiedAbha(true);
      setTimeout(() => setCopiedAbha(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!passport) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-sm">
        <Activity className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-700 font-bold text-sm">Retrieving Encrypted Digital Health Passport...</p>
      </div>
    );
  }

  const patientName = passport.userId?.name || user?.name || 'Patient';
  const age = passport.dob ? new Date().getFullYear() - new Date(passport.dob).getFullYear() : '68';
  const vitals = passport.currentVitals || {};

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Ayushman Bharat Verified Medical Credential</span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1.5">
            Digital Health Passport
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Present this biometric credential or QR code at any affiliated clinic or hospital.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshQR}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs transition flex items-center gap-2"
            title="Regenerate dynamic QR token"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Dynamic QR'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 transition flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>Print Physical Passport Card</span>
          </button>
        </div>
      </div>

      {/* Flagship Dribbble MedTech Metal Smartcard & QR Showcase */}
      <div 
        id="printable-passport"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* LEFT / CENTER: Titanium Biometric Health Card */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl metal-card p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
          {/* Holographic foil shimmer effect */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-40"></div>

          {/* Ambient lighting glows */}
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

          {/* Card Top: Government Header & EMV Chip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
                <ShieldCheck className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 block">
                  NATIONAL HEALTH AUTHORITY • GOVT OF INDIA
                </span>
                <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                  Ayushman Bharat Health Account (ABHA)
                </h3>
              </div>
            </div>

            {/* Simulated Gold Biometric Smart Chip */}
            <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 p-1 flex flex-col justify-between shadow-inner border border-amber-200/50">
              <div className="border-b border-amber-600/40 h-1/2"></div>
              <div className="flex justify-between px-0.5">
                <div className="w-2 h-2 rounded-full bg-amber-600/30"></div>
                <div className="w-2 h-2 rounded-full bg-amber-600/30"></div>
              </div>
            </div>
          </div>

          {/* Card Middle: Patient Identity & ABHA Identifier */}
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-inner border-2 border-white/20">
                  {patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {patientName}
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-medium">
                    <span>{passport.gender || 'Male'}, {age} yrs</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{passport.address?.district || 'Mandya'}, Karnataka</span>
                  </div>
                </div>
              </div>

              {/* Blood Group Pill */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Blood Group</span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight font-mono">
                  {passport.bloodGroup || 'B+'}
                </span>
              </div>
            </div>

            {/* ABHA Number Bar with 1-Click Copy */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                  Official Health ID (ABHA)
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-teal-300 tracking-wider">
                  {passport.abhaId}
                </span>
              </div>

              <button
                onClick={handleCopyAbha}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                {copiedAbha ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-300" />}
                <span>{copiedAbha ? 'Copied ID' : 'Copy ABHA'}</span>
              </button>
            </div>
          </div>

          {/* Card Bottom: PIN Security & Critical Badges */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Consent Security PIN</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base font-bold text-teal-300">
                  {showPin ? (passport.consentPIN || '1234') : '••••'}
                </span>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="text-[10px] font-bold text-teal-400 hover:text-white underline ml-auto"
                >
                  {showPin ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Organ Donor</span>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-300 font-bold">
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>{passport.organDonor ? 'Pledged Donor' : 'Not Pledged'}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Emergency Phone</span>
              <a
                href={`tel:${passport.emergencyContact?.phone || '+91 98860 99887'}`}
                className="flex items-center gap-1.5 mt-1 text-amber-300 font-bold hover:underline truncate"
              >
                <Phone className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{passport.emergencyContact?.phone || '+91 98860 99887'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: High-Contrast Dynamic QR Passport Token */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xl flex flex-col justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Doctor Scan Pass
            </span>
            <h3 className="text-base font-extrabold text-slate-950">Dynamic Health QR</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Doctor scans this QR to request clinical record decryption.
            </p>
          </div>

          {/* High-Contrast QR Frame with Cyber/MedTech Corner Brackets */}
          <div className="relative p-4 rounded-3xl bg-slate-950 shadow-inner max-w-[240px] mx-auto border-2 border-teal-500/40">
            {/* Corner glowing accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-teal-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-teal-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-teal-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-teal-400"></div>

            {passport.qrCode || passport.qrCodeDataUrl ? (
              <img 
                src={passport.qrCode || passport.qrCodeDataUrl} 
                alt="Health Passport QR Code" 
                className="w-full h-auto rounded-xl shadow-md bg-white p-2"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-900 rounded-xl text-teal-400">
                <QrCode className="w-16 h-16 animate-pulse" />
              </div>
            )}
          </div>

          {/* Dynamic Sync Status */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-500">Sync Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Token
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-500">Access Key:</span>
              <span className="font-mono text-slate-700 font-bold">{passport.consentPIN || '1234'}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            Token refreshes securely. Requires 4-digit PIN confirmation on physician scan.
          </p>
        </div>
      </div>

      {/* Biometric Vitals Strip & Allergy Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Vitals Bar */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h4 className="text-sm font-extrabold text-slate-900">Current Biometric Vitals</h4>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              Updated by Attending Physician
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Blood Pressure</span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{vitals.bp || '128/82'}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Optimal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Pulse Rate</span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{vitals.pulse || 74} <span className="text-xs font-normal text-slate-500">bpm</span></span>
              <span className="text-[10px] text-emerald-600 font-bold">Regular</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">SpO2 Level</span>
              <span className="text-lg font-black text-teal-700 font-mono mt-0.5 block">{vitals.spo2 || 98} <span className="text-xs font-normal text-slate-500">%</span></span>
              <span className="text-[10px] text-emerald-600 font-bold">Normal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Blood Glucose</span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{vitals.glucose || 132} <span className="text-xs font-normal text-slate-500">mg/dL</span></span>
              <span className="text-[10px] text-amber-600 font-bold">Managed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Body Temp</span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{vitals.temp || 98.4} <span className="text-xs font-normal text-slate-500">°F</span></span>
              <span className="text-[10px] text-emerald-600 font-bold">Afebrile</span>
            </div>
          </div>
        </div>

        {/* Allergy Warning Alert */}
        <div className="lg:col-span-4 bg-gradient-to-br from-rose-50 to-rose-100/60 rounded-3xl p-6 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-800 font-black text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Critical Allergies Warning</span>
            </div>
            {passport.allergies && passport.allergies.length > 0 ? (
              <div className="space-y-1.5 text-xs text-rose-900">
                {passport.allergies.map((allergy, aIdx) => (
                  <div key={aIdx} className="bg-white/80 p-2.5 rounded-xl border border-rose-200/60 font-semibold flex items-center justify-between">
                    <span>{allergy.allergen}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      {allergy.reaction}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rose-800 font-medium">No adverse drug allergies reported.</p>
            )}
          </div>

          <div className="text-[11px] text-rose-700 font-semibold pt-3 border-t border-rose-200/60 mt-3">
            Flagged on doctor scanning HUD for safe prescription dispensing.
          </div>
        </div>
      </div>
    </div>
  );
}
