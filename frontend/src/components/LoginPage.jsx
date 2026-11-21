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
  User, 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Building2, 
  Award, 
  Briefcase,
  HeartHandshake,
  Check
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
    hospital: 'City General Hospital',
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
        name: patientData.emergencyContactName || 'Family Member',
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

  return (
    <div className="min-h-screen bg-slate-100/70 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Reassuring, Human Healthcare Context */}
        <div className="lg:col-span-5 space-y-6 text-slate-800 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-700" />
            <span>Patient-Centered Healthcare Records</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Compassionate Care.<br />
              <span className="text-blue-700">Consent-Driven History.</span>
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              A private digital health passport that puts patients in control. Present your QR code at the clinic, and unlock your medical records only when you authorize with your security PIN.
            </p>
          </div>

          {/* Calm, Humanized Feature List */}
          <div className="space-y-3 pt-2 text-left">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Personal Health Passport & QR</div>
                <div className="text-slate-500 mt-0.5">Instant universal access to blood group, vitals, and emergency contacts.</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Explicit Patient PIN Consent</div>
                <div className="text-slate-500 mt-0.5">Doctors cannot view sensitive history until you confirm your 4-digit PIN.</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Longitudinal Clinical Ledger</div>
                <div className="text-slate-500 mt-0.5">Permanent, chronological records of diagnoses, vitals, and medication plans.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    QR Health Passport
                  </h2>
                  <p className="text-xs text-slate-500">Sign in or register your account</p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Secure Portal
              </span>
            </div>

            {/* Mode Tabs: Sign In vs Create Account */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-blue-700" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-blue-700" />
                <span>Create Account</span>
              </button>
            </div>

            {/* In Register Mode: Sub-Tabs for Patient vs Doctor */}
            {mode === 'register' && (
              <div className="bg-slate-50 border border-slate-200/80 p-1 rounded-xl mb-4 flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setRegRole('patient'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    regRole === 'patient' 
                      ? 'bg-blue-700 text-white shadow-xs font-bold' 
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
                      ? 'bg-blue-700 text-white shadow-xs font-bold' 
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
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      Password
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-700 hover:underline font-medium flex items-center gap-1"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-2">
                  Protected with industry-standard 256-bit encryption.
                </p>
              </form>
            )}

            {/* MODE 2A: PATIENT REGISTRATION FORM */}
            {mode === 'register' && regRole === 'patient' && (
              <form onSubmit={handlePatientRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    placeholder="e.g. Rameshwar Gowda"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={patientData.email}
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      placeholder="patient@mail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={patientData.password}
                      onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                    <select
                      value={patientData.bloodGroup}
                      onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 font-bold text-rose-700 bg-white"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={patientData.dob}
                      onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>
                    A personal <strong>Universal Health ID</strong> and dynamic <strong>QR Health Passport</strong> will be generated automatically.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Account...' : 'Complete Patient Registration'}</span>
                </button>
              </form>
            )}

            {/* MODE 2B: DOCTOR REGISTRATION FORM */}
            {mode === 'register' && regRole === 'doctor' && (
              <form onSubmit={handleDoctorRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    required
                    value={doctorData.name}
                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma, MD"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Professional Email</label>
                    <input
                      type="email"
                      required
                      value={doctorData.email}
                      onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                      placeholder="doctor@hospital.org"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={doctorData.password}
                      onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-700" />
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={doctorData.licenseNumber}
                      onChange={(e) => setDoctorData({ ...doctorData, licenseNumber: e.target.value })}
                      placeholder="e.g. KMC-48291-KA"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="1"
                      value={doctorData.experienceYears}
                      onChange={(e) => setDoctorData({ ...doctorData, experienceYears: e.target.value })}
                      placeholder="10"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clinical Specialization</label>
                  <select
                    value={doctorData.specialization}
                    onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white"
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
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      Hospital / Clinic
                    </label>
                    <input
                      type="text"
                      value={doctorData.hospital}
                      onChange={(e) => setDoctorData({ ...doctorData, hospital: e.target.value })}
                      placeholder="Apex Heart Institute"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                      Department
                    </label>
                    <input
                      type="text"
                      value={doctorData.department}
                      onChange={(e) => setDoctorData({ ...doctorData, department: e.target.value })}
                      placeholder="Cardiology"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={doctorData.phone}
                    onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200/60 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Upon registration, doctor clinical privileges are granted to scan patient QR codes, initiate consent handshakes, and record treatments.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>{loading ? 'Registering Physician...' : 'Register as Doctor'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
