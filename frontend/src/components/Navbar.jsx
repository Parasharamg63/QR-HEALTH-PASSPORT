import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  QrCode, 
  FileText, 
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const isDoctor = user?.role === 'doctor';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Consent-Driven HealthTech Platform</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-teal-400">ABHA Digital Health Network</span>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            Secure Session Active
          </div>
        </div>
      </div>

      {/* Main Header */}
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
              Patient QR Verification • Consent-Governed Medical Records
            </p>
          </div>
        </div>

        {/* User Profile & Standard Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-xs">
              {isDoctor ? <Stethoscope className="w-4 h-4 text-teal-700" /> : <User className="w-4 h-4 text-teal-700" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-none">{user?.name}</div>
              <div className="text-[10px] uppercase font-bold text-teal-700 mt-1">
                {isDoctor ? 'Authorized Doctor' : 'Registered Patient'}
              </div>
            </div>
          </div>

          {/* Standard Logout Button */}
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            title="Sign out of your session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs based on logged in role */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-2 border-t border-slate-100 py-1.5 text-xs sm:text-sm font-semibold">
        {!isDoctor ? (
          <>
            <button
              onClick={() => setActiveTab('passport')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                activeTab === 'passport' 
                  ? 'bg-teal-50 text-teal-800 font-bold border-b-2 border-teal-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>My Health Passport & QR</span>
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
          </>
        ) : (
          <button
            onClick={() => setActiveTab('doctorPortal')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 font-bold border-b-2 border-blue-600"
          >
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>Doctor Clinical Portal (Scan Patient QR & Record Treatment)</span>
          </button>
        )}
      </nav>
    </header>
  );
}
