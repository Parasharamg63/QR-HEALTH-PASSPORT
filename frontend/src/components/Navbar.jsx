import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  QrCode, 
  FileText, 
  LogOut,
  User,
  Activity,
  Sparkles,
  Lock
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const isDoctor = user?.role === 'doctor';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      {/* Top ABDM Network Status Ribbon */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200 tracking-wide text-[11px]">
              Ayushman Bharat Digital Mission (ABDM) • Encrypted TLS 1.3
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-teal-400 text-[11px] font-medium">
              Zero-Knowledge Patient Consent Protocol Active
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <Lock className="w-3 h-3 text-teal-400" />
            <span className="hidden sm:inline">256-Bit Ledger Active</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">
                QR HEALTH <span className="text-teal-600">PASSPORT</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
                Official Clinical ID
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              Patient QR Verification • Consent-Governed Medical Records
            </p>
          </div>
        </div>

        {/* User Profile & Standard Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              isDoctor ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-teal-600 to-emerald-600'
            }`}>
              {isDoctor ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</div>
              <div className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                {isDoctor ? 'Authorized Doctor' : 'Registered Patient'}
              </div>
            </div>
          </div>

          {/* Standard Logout Button */}
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            title="Sign out of your session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Segmented Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center space-x-2 border-t border-slate-100 py-2 text-xs sm:text-sm font-semibold">
        {!isDoctor ? (
          <>
            <button
              onClick={() => setActiveTab('passport')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ${
                activeTab === 'passport' 
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Digital Health Passport & QR</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ${
                activeTab === 'history' 
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Medical History Ledger</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('doctorPortal')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Clinical Portal • Scan Patient QR & Record Treatment</span>
          </button>
        )}
      </nav>
    </header>
  );
}
