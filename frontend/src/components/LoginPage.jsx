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
  Stethoscope,
  Activity,
  Heart,
  CheckCircle2,
  Phone,
  Eye,
  EyeOff,
  Building2,
  Award,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [regRole, setRegRole] = useState('patient'); // 'patient' | 'doctor'
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Patient)
  const [patientData, setPatientData] = useState({
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

  // Register form state (Doctor)
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    specialization: 'General Physician & Internal Medicine',
    hospital: 'Apex Heart & Super-Specialty Institute',
    department: 'General Medicine',
    experienceYears: '10',
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

  const handlePatientRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!patientData.name || !patientData.email || !patientData.password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    const payload = {
      name: patientData.name,
      email: patientData.email.trim(),
      password: patientData.password,
      role: 'patient',
      phone: patientData.phone || '+91 98765 43210',
      bloodGroup: patientData.bloodGroup,
      gender: patientData.gender,
      dob: patientData.dob,
      emergencyContact: {
        name: patientData.emergencyContactName || 'Family Contact',
        relation: 'Primary Contact',
        phone: patientData.emergencyContactPhone || patientData.phone || '+91 98765 43210',
      },
    };

    const res = await register(payload);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleDoctorRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!doctorData.name || !doctorData.email || !doctorData.password || !doctorData.licenseNumber) {
      setError('Please fill in doctor name, email, password, and medical license number.');
      return;
    }

    const payload = {
      name: doctorData.name.startsWith('Dr.') ? doctorData.name : `Dr. ${doctorData.name}`,
      email: doctorData.email.trim(),
      password: doctorData.password,
      role: 'doctor',
      phone: doctorData.phone || '+91 98450 11223',
      doctorDetails: {
        licenseNumber: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        hospital: doctorData.hospital,
        department: doctorData.department,
        experienceYears: Number(doctorData.experienceYears) || 5,
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto">
        
        {/* Left Column: MedTech Showcase & Live Trust Metrics (Desktop) */}
        <div className="lg:col-span-5 space-y-6 text-white text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            <span>Decentralized Clinical Health Protocol</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              One Scan.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                Total Medical History.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              Transform clinical healthcare with cryptographic QR health passports. Patient records stay 100% encrypted until explicit 4-digit PIN consent is provided.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-teal-400 font-black text-xl sm:text-2xl">100%</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Consent Governed</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-black text-xl sm:text-2xl">Zero</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Data Leakage</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-cyan-400 font-black text-xl sm:text-2xl">Instant</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Health ID Issuance</div>
            </div>
          </div>

          {/* Live Persona Quick-Fill Chips for Evaluators */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Demo Personas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('doctor.rajesh@hospital.org', 'password123')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-105 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dr. Rajesh Sharma</div>
                  <div className="text-[10px] text-slate-400">Cardiologist • Apex Hospital</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('rameshwar.gowda@patient.org', 'password123')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 group-hover:scale-105 transition">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Rameshwar Gowda</div>
                  <div className="text-[10px] text-slate-400">Patient • Health ID #91-4421...</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dribbble MedTech Glassmorphic Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative">
            {/* Header Branding in Card */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                    QR HEALTH <span className="text-teal-600">PASSPORT</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Universal Clinical Health Network</p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200">
                v2.4 Secure
              </div>
            </div>

            {/* Mode Switcher: Sign In vs Register */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-teal-600" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>Create New Account</span>
              </button>
            </div>

            {/* In Register Mode: Role Selection Sub-Tabs */}
            {mode === 'register' && (
              <div className="bg-slate-50 border border-slate-200 p-1 rounded-xl mb-4 flex items-center gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setRegRole('patient'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    regRole === 'patient' 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Register as Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRegRole('doctor'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    regRole === 'doctor' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Register as Doctor</span>
                </button>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="doctor.rajesh@hospital.org or patient email"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      Password
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : 'Sign In to Health Passport'}</span>
                </button>

                <p className="text-center text-[11px] text-slate-400 pt-2">
                  Protected by 256-bit encryption • Compliant with HIPAA & HL7/FHIR Security Standards
                </p>
              </form>
            )}

            {/* MODE 2A: PATIENT REGISTRATION FORM */}
            {mode === 'register' && regRole === 'patient' && (
              <form onSubmit={handlePatientRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    placeholder="e.g. Rameshwar Gowda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={patientData.email}
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      placeholder="patient@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={patientData.password}
                      onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                    <select
                      value={patientData.bloodGroup}
                      onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold text-rose-600 bg-slate-50/50"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 font-medium bg-slate-50/50"
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
                      value={patientData.dob}
                      onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 font-medium bg-slate-50/50 text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50/50"
                  />
                </div>

                <div className="p-3 bg-teal-50/80 border border-teal-200/60 rounded-2xl text-[11px] text-teal-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Upon registration, an official <strong>Universal Health ID (UHID)</strong> and personal <strong>Health Passport QR Code</strong> are generated automatically.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Passport...' : 'Register Patient & Issue QR Passport'}</span>
                </button>
              </form>
            )}

            {/* MODE 2B: DOCTOR REGISTRATION FORM */}
            {mode === 'register' && regRole === 'doctor' && (
              <form onSubmit={handleDoctorRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Legal Full Name</label>
                  <input
                    type="text"
                    required
                    value={doctorData.name}
                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma, MD, DM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Doctor Email Address</label>
                    <input
                      type="email"
                      required
                      value={doctorData.email}
                      onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                      placeholder="doctor@hospital.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={doctorData.password}
                      onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={doctorData.licenseNumber}
                      onChange={(e) => setDoctorData({ ...doctorData, licenseNumber: e.target.value })}
                      placeholder="e.g. KMC-48291-KA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="1"
                      value={doctorData.experienceYears}
                      onChange={(e) => setDoctorData({ ...doctorData, experienceYears: e.target.value })}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Specialization</label>
                  <select
                    value={doctorData.specialization}
                    onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
                  >
                    <option value="Chief Consultant Cardiologist">Chief Consultant Cardiologist</option>
                    <option value="General Physician & Internal Medicine">General Physician & Internal Medicine</option>
                    <option value="Consultant Diabetologist & Endocrinologist">Consultant Diabetologist & Endocrinologist</option>
                    <option value="Consultant Pulmonologist">Consultant Pulmonologist</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Emergency Care Specialist">Emergency Care Specialist</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Hospital / Clinic
                    </label>
                    <input
                      type="text"
                      value={doctorData.hospital}
                      onChange={(e) => setDoctorData({ ...doctorData, hospital: e.target.value })}
                      placeholder="Apex Heart Institute"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Department
                    </label>
                    <input
                      type="text"
                      value={doctorData.department}
                      onChange={(e) => setDoctorData({ ...doctorData, department: e.target.value })}
                      placeholder="Cardiology / Medicine"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Contact Phone</label>
                  <input
                    type="text"
                    value={doctorData.phone}
                    onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                    placeholder="+91 98450 11223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50/50"
                  />
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200/60 rounded-2xl text-[11px] text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Upon registration, doctor clinical privileges will be active immediately to scan patient QR codes, initiate consent handshakes, and record treatments.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>{loading ? 'Registering Physician...' : 'Register as Doctor & Launch Clinical Portal'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
