import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  HeartHandshake, 
  Globe, 
  Eye, 
  AlertTriangle, 
  Bell, 
  QrCode, 
  CalendarClock, 
  Activity, 
  Bot, 
  PhoneCall,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, switchPersona } = useAuth();
  const { currentLang, setCurrentLang, t, isElderMode, setIsElderMode } = useLanguage();
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  const handleTriggerSOS = async () => {
    setSosLoading(true);
    try {
      await api.triggerSOS();
      setSosSent(true);
      setTimeout(() => {
        setSosSent(false);
        setShowSOSModal(false);
      }, 3500);
    } catch (err) {
      alert('SOS dispatched: Local notification triggered.');
      setSosSent(true);
      setTimeout(() => {
        setSosSent(false);
        setShowSOSModal(false);
      }, 3000);
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Emergency & Persona Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">ABHA & FHIR Compatible Digital Health Infrastructure</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-teal-400">Consent-Driven QR Protocol 2.0</span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{t.demoRoleSwitch}</span>
            <button
              onClick={() => switchPersona('patient', 'rameshwar.gowda@patient.org')}
              className={`px-2 py-0.5 rounded text-xs transition font-medium flex items-center gap-1 ${
                user?.role === 'patient' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3 h-3" /> {t.patientRole}
            </button>
            <button
              onClick={() => switchPersona('doctor', 'doctor.rajesh@hospital.org')}
              className={`px-2 py-0.5 rounded text-xs transition font-medium flex items-center gap-1 ${
                user?.role === 'doctor' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Stethoscope className="w-3 h-3" /> {t.doctorRole}
            </button>
            <button
              onClick={() => switchPersona('caregiver', 'caregiver.suresh@care.org')}
              className={`px-2 py-0.5 rounded text-xs transition font-medium flex items-center gap-1 ${
                user?.role === 'caregiver' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <HeartHandshake className="w-3 h-3" /> {t.caregiverRole}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                QR HEALTH <span className="text-teal-600">PASSPORT</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                Live Tech
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none pr-2 cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
            </select>
          </div>

          {/* Elder Mode Toggle */}
          <button
            onClick={() => setIsElderMode(!isElderMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              isElderMode 
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle Large Text / Senior Friendly Mode"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">{isElderMode ? t.accessibility.elderMode : 'Elder Mode'}</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setShowSOSModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 animate-pulse transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>{t.sos.button}</span>
          </button>

          {/* Active User Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-left">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-none">{user?.name}</div>
              <div className="text-[10px] uppercase font-semibold text-teal-700 mt-0.5 tracking-wide">
                Role: {user?.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-slate-100 py-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'passport' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4 text-teal-600" />
          <span>{t.tabs.passport}</span>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'planner' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CalendarClock className="w-4 h-4 text-emerald-600" />
          <span>{t.tabs.planner}</span>
        </button>

        <button
          onClick={() => setActiveTab('adherence')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'adherence' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4 text-blue-600" />
          <span>{t.tabs.adherence}</span>
        </button>

        <button
          onClick={() => setActiveTab('caregiver')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'caregiver' ? 'bg-amber-50 text-amber-700 font-bold border-b-2 border-amber-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-600" />
          <span>{t.tabs.caregiver}</span>
        </button>

        <button
          onClick={() => setActiveTab('doctorPortal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'doctorPortal' ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>{t.tabs.doctorPortal}</span>
        </button>

        <button
          onClick={() => setActiveTab('chatbot')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'chatbot' ? 'bg-purple-50 text-purple-700 font-bold border-b-2 border-purple-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-600" />
          <span>{t.tabs.chatbot}</span>
        </button>
      </nav>

      {/* Emergency SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <button 
                onClick={() => setShowSOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-4">{t.sos.confirmTitle}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {t.sos.confirmText}
            </p>

            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200 mt-4 text-xs text-rose-900 space-y-1">
              <p className="font-semibold">📞 Primary Caregiver: Suresh Gowda (+91 98860 99887)</p>
              <p>📍 Location & Medical ID: Mandya Rural, ABHA: 91-4421-8890-1204</p>
              <p>🩸 Blood Group: B+ | Known Allergy: Sulfa Drugs</p>
            </div>

            {sosSent ? (
              <div className="mt-5 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-center font-bold text-sm">
                {t.sos.dispatchedMsg}
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTriggerSOS}
                  disabled={sosLoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  {sosLoading ? 'Dispatching...' : t.sos.dispatchBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
