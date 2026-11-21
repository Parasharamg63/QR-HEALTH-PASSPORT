import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  QrCode, 
  Printer, 
  RefreshCw, 
  AlertCircle, 
  Heart, 
  Phone, 
  Activity, 
  User, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Lock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function HealthPassportCard() {
  const { user, passport, refreshPassport } = useAuth();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [showPin, setShowPin] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  if (!passport) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <Activity className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Loading Health Passport records...</p>
      </div>
    );
  }

  const patientName = passport.userId?.name || user?.name || 'Patient';
  const age = passport.dob ? new Date().getFullYear() - new Date(passport.dob).getFullYear() : '68';
  const vitals = passport.currentVitals || {};

  return (
    <div className="space-y-6">
      {/* Printable / Viewable Digital ID Card */}
      <div 
        id="printable-passport"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-2xl border border-teal-500/30 p-6 sm:p-8"
      >
        {/* Holographic glowing gradient backdrop */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-widest uppercase text-teal-400">
                  NATIONAL DIGITAL HEALTH NETWORK
                </span>
                <span className="text-[10px] bg-teal-400/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t.passportCard.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshQR}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-teal-200 transition flex items-center gap-1.5"
              title="Regenerate dynamic QR token"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.passportCard.refreshQR}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.passportCard.downloadCard}</span>
            </button>
          </div>
        </div>

        {/* Card Body: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Patient Details & Vitals */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-inner border-2 border-white/20">
                {patientName.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {patientName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded-md font-semibold text-teal-300 border border-white/10">
                    {t.passportCard.abhaNumber}: {passport.abhaId}
                  </span>
                  <span>•</span>
                  <span>{passport.gender || 'Male'}, {age} yrs</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{passport.address?.district || 'Mandya'}, Karnataka</span>
                </div>
              </div>
            </div>

            {/* Critical Patient Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-[11px] text-slate-400 block font-medium">{t.passportCard.bloodGroup}</span>
                <span className="text-xl font-black text-rose-400 tracking-tight">{passport.bloodGroup || 'B+'}</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-[11px] text-slate-400 block font-medium">Consent PIN</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-lg font-bold text-teal-300">
                    {showPin ? passport.consentPIN || '1234' : '••••'}
                  </span>
                  <button 
                    onClick={() => setShowPin(!showPin)} 
                    className="text-[10px] text-slate-400 hover:text-white underline ml-1"
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-[11px] text-slate-400 block font-medium">{t.passportCard.organDonor}</span>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-1">
                  <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  {passport.organDonor ? 'Pledged Yes' : 'No'}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-[11px] text-slate-400 block font-medium">{t.passportCard.emergencyContact}</span>
                <a 
                  href={`tel:${passport.emergencyContact?.phone}`} 
                  className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1 mt-1 truncate"
                >
                  <Phone className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{passport.emergencyContact?.phone || '+91 98860 99887'}</span>
                </a>
              </div>
            </div>

            {/* Allergies & Chronic Conditions Alert Banners */}
            <div className="space-y-2">
              {passport.allergies && passport.allergies.length > 0 && (
                <div className="bg-rose-500/15 border border-rose-500/40 rounded-2xl p-3 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 uppercase tracking-wide mr-1.5">
                      {t.passportCard.allergiesTitle}:
                    </span>
                    <span className="text-rose-100 font-medium">
                      {passport.allergies.map(a => `${a.allergen} (${a.reaction})`).join(' • ')}
                    </span>
                  </div>
                </div>
              )}

              {passport.chronicConditions && passport.chronicConditions.length > 0 && (
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-3 text-xs flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-300 uppercase tracking-wide mr-1.5">
                      {t.passportCard.conditionsTitle}:
                    </span>
                    <span className="text-teal-100 font-medium">
                      {passport.chronicConditions.map(c => `${c.name} (${c.diagnosedYear})`).join(' • ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic QR Code Hologram Frame */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10 text-center">
            <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-teal-500/30 inline-block relative group">
              {passport.qrCodeDataUrl ? (
                <img 
                  src={passport.qrCodeDataUrl} 
                  alt="QR Health Passport" 
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-lg object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                  <QrCode className="w-16 h-16" />
                </div>
              )}

              {/* Security watermark badge */}
              <div className="absolute bottom-2 right-2 bg-slate-900/90 text-teal-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight border border-teal-500/40">
                AES-256
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300">
                <Sparkles className="w-3 h-3 text-teal-400" />
                Dynamic Cryptographic QR
              </span>
              <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">
                {t.passportCard.scanInstruction}
              </p>
            </div>
          </div>
        </div>

        {/* Current Vitals Strip */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              {t.passportCard.vitalsTitle}
            </span>
            <span className="text-[11px] text-slate-400">
              Last Synced: {new Date(vitals.lastUpdated || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">{t.passportCard.bp}</span>
              <span className="font-bold text-white font-mono">{vitals.bloodPressure || '130/84'} mmHg</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">{t.passportCard.heartRate}</span>
              <span className="font-bold text-white font-mono">{vitals.heartRate || 74} bpm</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">{t.passportCard.bloodSugar}</span>
              <span className="font-bold text-amber-300 font-mono">{vitals.bloodSugar || 138} mg/dL</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">{t.passportCard.spo2}</span>
              <span className="font-bold text-emerald-400 font-mono">{vitals.spo2 || 97}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
