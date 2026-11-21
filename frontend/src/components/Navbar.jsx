import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  QrCode, 
  FileText, 
  LogOut,
  User,
  Lock,
  HeartHandshake
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const isDoctor = user?.role === 'doctor';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Reassuring Top Sub-Bar */}
      <div className="bg-slate-50 text-slate-600 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span className="font-medium text-slate-700 text-[11px]">
              Encrypted Clinical Records Network
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-slate-500 text-[11px]">
              Patient PIN Consent Required for Record Decryption
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
            <Lock className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">256-Bit TLS Protected</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Organization Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                QR Health <span className="text-blue-700 font-extrabold">Passport</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                Medical Records
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal hidden sm:block mt-0.5">
              Secure Patient Passport & Clinical Consultation System
            </p>
          </div>
        </div>

        {/* User Profile & Standard Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
              isDoctor ? 'bg-blue-700' : 'bg-slate-700'
            }`}>
              {isDoctor ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</div>
              <div className="text-[10px] font-semibold text-slate-500">
                {isDoctor ? 'Authorized Physician' : 'Registered Patient'}
              </div>
            </div>
          </div>

          {/* Standard Logout Button */}
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Sign out of your session"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Clean Hospital Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center space-x-1 border-t border-slate-100 py-1.5 text-xs sm:text-sm font-semibold">
        {!isDoctor ? (
          <>
            <button
              onClick={() => setActiveTab('passport')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                activeTab === 'passport' 
                  ? 'bg-blue-50 text-blue-900 font-bold border-b-2 border-blue-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4 text-blue-700" />
              <span>My Health Passport & QR</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                activeTab === 'history' 
                  ? 'bg-blue-50 text-blue-900 font-bold border-b-2 border-blue-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Medical History Ledger</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('doctorPortal')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-900 font-bold border-b-2 border-blue-700"
          >
            <Stethoscope className="w-4 h-4 text-blue-700" />
            <span>Doctor Clinical Portal • Scan QR & Record Consultation</span>
          </button>
        )}
      </nav>
    </header>
  );
}
