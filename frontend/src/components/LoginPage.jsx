import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  AlertCircle, 
  QrCode, 
  Sparkles,
  User,
  Stethoscope 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'B+',
    gender: 'Male',
    dob: '1985-06-15',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!regData.name || !regData.email || !regData.password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    const payload = {
      name: regData.name,
      email: regData.email.trim(),
      password: regData.password,
      role: 'patient',
      phone: regData.phone || '+91 98765 43210',
      bloodGroup: regData.bloodGroup,
      gender: regData.gender,
      dob: regData.dob,
      emergencyContact: {
        name: regData.emergencyContactName || 'Family Contact',
        relation: 'Primary Contact',
        phone: regData.emergencyContactPhone || regData.phone || '+91 98765 43210',
      },
    };

    const res = await register(payload);
    if (!res.success) {
      setError(res.message);
    }
  };

  // Quick fill demo helper
  const handleQuickFill = (email, pwd) => {
    setLoginEmail(email);
    setLoginPassword(pwd);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            QR HEALTH <span className="text-teal-600">PASSPORT</span>
          </h1>
          <p className="text-xs text-slate-500">
            Smart Patient-Centric Healthcare • Consent-Governed Medical Records
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-teal-600" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>Register as Patient</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. rameshwar.gowda@patient.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>

            {/* Quick Fill Credentials Helper */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Sign-In (Demo Credentials):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('rameshwar.gowda@patient.org', 'password123')}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left text-[11px]"
                >
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3 h-3 text-teal-600" /> Patient Login
                  </div>
                  <span className="text-slate-400 text-[10px] block truncate">Rameshwar Gowda</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('doctor.rajesh@hospital.org', 'password123')}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left text-[11px]"
                >
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-blue-600" /> Doctor Login
                  </div>
                  <span className="text-slate-400 text-[10px] block truncate">Dr. Rajesh Sharma</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                placeholder="e.g. Suresh Kumar"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="suresh@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                <select
                  value={regData.bloodGroup}
                  onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gender</label>
                <select
                  value={regData.gender}
                  onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Birth Date</label>
                <input
                  type="date"
                  value={regData.dob}
                  onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-slate-900 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={regData.phone}
                onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 mt-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{loading ? 'Registering...' : 'Register & Create Health Passport'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
