import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  QrCode, 
  FileText, 
  LogOut,
  User,
  Lock,
  HeartHandshake,
  Palette,
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const isDoctor = user?.role === 'doctor';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Reassuring Top Sub-Bar with Live Theme Selector */}
      <div className="bg-[#111111] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span className="font-bold text-white text-[11px] tracking-wide">
              Universal Clinical Health Network
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              Consent-Governed Cryptographic EHR Network (256-Bit TLS)
            </span>
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700 transition cursor-pointer"
            >
              <Palette className="w-3 h-3 text-[#00A4A6]" />
              <span className="hidden sm:inline">Theme:</span>
              <span className="text-[#00A4A6]">{currentTheme.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in duration-150"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Visual Interface Themes
                  </span>
                  <span className="text-xs font-bold text-slate-800">Choose Interface Style</span>
                </div>

                <div className="space-y-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                        theme === t.id 
                          ? 'bg-slate-100 text-slate-950 font-black' 
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0"
                          style={{ backgroundColor: t.accentColor }}
                        ></span>
                        <div>
                          <div className="text-xs font-bold leading-tight">{t.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{t.tagline}</div>
                        </div>
                      </div>

                      {theme === t.id && (
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Organization Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#111111] flex items-center justify-center text-white shadow-sm border border-slate-800">
            <HeartHandshake className="w-6 h-6 text-[#00A4A6]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-none">
                QR HEALTH <span className="text-[#00838C]">PASSPORT</span>
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                Universal Health ID
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              Secure Universal Health Passport & Verified Doctor Consultation Ecosystem
            </p>
          </div>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
              isDoctor ? 'bg-[#00838C]' : 'bg-[#111111]'
            }`}>
              {isDoctor ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</div>
              <div className="text-[10px] font-semibold text-slate-500">
                {isDoctor ? 'Licensed Physician' : 'Verified Patient'}
              </div>
            </div>
          </div>

          {/* Standard Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Sign out of your session"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center space-x-2 border-t border-slate-100 py-2 text-xs sm:text-sm font-semibold">
        {!isDoctor ? (
          <>
            <button
              onClick={() => setActiveTab('passport')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'passport' 
                  ? 'bg-[#111111] text-white font-extrabold shadow-sm' 
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-semibold'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#00A4A6]" />
              <span>Digital Health Passport & QR</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-[#111111] text-white font-extrabold shadow-sm' 
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-semibold'
              }`}
            >
              <FileText className="w-4 h-4 text-[#00A4A6]" />
              <span>Medical History Ledger</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('doctorPortal')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-white font-extrabold shadow-sm"
          >
            <Stethoscope className="w-4 h-4 text-[#00A4A6]" />
            <span>Doctor Clinical Portal • Scan QR & Record Consultation</span>
          </button>
        )}
      </nav>
    </header>
  );
}
