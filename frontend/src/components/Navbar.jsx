import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  UserPlus, 
  QrCode, 
  FileText 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenRegister }) {
  const { user, switchPersona } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Consent-Driven HealthTech Platform</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-teal-400">Dynamic Patient QR Code & Medical Record Synchronization</span>
          </div>

          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Switch Role:</span>
            <button
              onClick={() => switchPersona('patient', 'rameshwar.gowda@patient.org')}
              className={`px-2.5 py-0.5 rounded-lg text-xs transition font-semibold flex items-center gap-1 ${
                user?.role === 'patient' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Patient (Rameshwar)
            </button>
            <button
              onClick={() => switchPersona('doctor', 'doctor.rajesh@hospital.org')}
              className={`px-2.5 py-0.5 rounded-lg text-xs transition font-semibold flex items-center gap-1 ${
                user?.role === 'doctor' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Doctor (Dr. Rajesh)
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                QR HEALTH <span className="text-teal-600">PASSPORT</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Official Clinical ID
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Patient QR Verification • Consent-Governed History • Clinical Treatment Ledger
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>

          {/* Active User Badge */}
          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-none">{user?.name}</div>
              <div className="text-[10px] uppercase font-semibold text-teal-700 mt-1">
                Role: {user?.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-2 border-t border-slate-100 py-1.5 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'passport' 
              ? 'bg-teal-50 text-teal-800 font-bold border-b-2 border-teal-600' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4 text-teal-600" />
          <span>Patient Health Passport & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'history' 
              ? 'bg-teal-50 text-teal-800 font-bold border-b-2 border-teal-600' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Medical History Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('doctorPortal')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'doctorPortal' 
              ? 'bg-blue-50 text-blue-800 font-bold border-b-2 border-blue-600' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>Doctor Portal (Scan QR & Treat)</span>
        </button>
      </nav>
    </header>
  );
}
