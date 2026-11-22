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
  Check,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const { lang, setLang, languages, currentLanguage, t } = useLanguage();
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
        
        {/* Left Column: Reassuring Healthcare Narrative */}
        <div className="lg:col-span-5 space-y-6 text-slate-800 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F7F8] border border-[#B2E5E8] text-[#005F66] text-xs font-bold">
              <HeartHandshake className="w-3.5 h-3.5 text-[#00838C]" />
              <span>{t('networkTitle')}</span>
            </div>

            {/* Quick Language Selector Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#00838C]" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
              {t('patientFirstCare')}<br />
              <span className="text-[#00838C]">{t('consentDrivenHistory')}</span>
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              {t('loginNarrative')}
            </p>
          </div>

          {/* Modern Feature Cards */}
          <div className="space-y-3 pt-2 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#00A4A6] flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-800">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-black text-slate-950">{t('personalPassportFeature')}</div>
                <div className="text-slate-500 font-medium mt-0.5">{t('universalAccessFeature')}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-black text-slate-950">{t('consentFeature')}</div>
                <div className="text-slate-500 font-medium mt-0.5">{t('pinConsentFeature')}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-black text-slate-950">{t('ledgerFeatureTitle')}</div>
                <div className="text-slate-500 font-medium mt-0.5">{t('ledgerFeature')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/90">
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#111111] flex items-center justify-center text-white shadow-xs border border-slate-800">
                  <HeartHandshake className="w-6 h-6 text-[#00A4A6]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950 leading-tight">
                    QR HEALTH <span className="text-[#00838C]">PASSPORT</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">{t('signInOrRegister')}</p>
                </div>
              </div>

              <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {t('protected256Tls')}
              </span>
            </div>

            {/* Mode Tabs: Sign In vs Create Account */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login' ? 'bg-[#111111] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <LogIn className="w-4 h-4 text-[#00A4A6]" />
                <span>{t('signIn')}</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register' ? 'bg-[#111111] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#00A4A6]" />
                <span>{t('createAccount')}</span>
              </button>
            </div>

            {/* In Register Mode: Sub-Tabs for Patient vs Doctor */}
            {mode === 'register' && (
              <div className="bg-slate-50 border border-slate-200/80 p-1 rounded-2xl mb-4 flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setRegRole('patient'); setError(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    regRole === 'patient' 
                      ? 'bg-[#111111] text-white shadow-xs font-black' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('registerPatientTab')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRegRole('doctor'); setError(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    regRole === 'doctor' 
                      ? 'bg-[#111111] text-white shadow-xs font-black' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{t('registerDoctorTab')}</span>
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
                    {t('emailAddress')}
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
                      {t('password')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-700 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? t('hide') : t('show')}</span>
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
                  className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-black text-white font-black text-sm shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#00A4A6]" />
                  <span>{loading ? t('signingIn') : t('signIn')}</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-2">
                  {t('networkSub')}
                </p>
              </form>
            )}

            {/* MODE 2A: PATIENT REGISTRATION FORM */}
            {mode === 'register' && regRole === 'patient' && (
              <form onSubmit={handlePatientRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t('fullName')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('emailAddress')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('password')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('bloodGroup')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('gender')}</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                    >
                      <option value="Male">{t('male')}</option>
                      <option value="Female">{t('female')}</option>
                      <option value="Other">{t('other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">{t('birthDate')}</label>
                    <input
                      type="date"
                      value={patientData.dob}
                      onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 font-medium text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t('contactPhone')}</label>
                  <input
                    type="text"
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00838C] flex-shrink-0 mt-0.5" />
                  <span>
                    {t('patientGenNote')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-black text-white font-black text-sm shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#00A4A6]" />
                  <span>{loading ? t('creatingAccount') : t('completePatientReg')}</span>
                </button>
              </form>
            )}

            {/* MODE 2B: DOCTOR REGISTRATION FORM */}
            {mode === 'register' && regRole === 'doctor' && (
              <form onSubmit={handleDoctorRegisterSubmit} className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t('fullName')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('emailAddress')}</label>
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('password')}</label>
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
                      {t('medicalLicenseNo')}
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
                    <label className="font-semibold text-slate-700 block mb-1">{t('experienceYears')}</label>
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
                  <label className="font-semibold text-slate-700 block mb-1">{t('specialization')}</label>
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
                      {t('hospitalClinic')}
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
                      {t('department')}
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
                  <label className="font-semibold text-slate-700 block mb-1">{t('contactPhone')}</label>
                  <input
                    type="text"
                    value={doctorData.phone}
                    onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00838C] flex-shrink-0 mt-0.5" />
                  <span>
                    {t('doctorGenNote')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-black text-white font-black text-sm shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-[#00A4A6]" />
                  <span>{loading ? t('registeringPhysician') : t('registerDoctorBtn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
