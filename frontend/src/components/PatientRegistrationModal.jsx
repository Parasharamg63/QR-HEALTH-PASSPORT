import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserPlus, QrCode, X, CheckCircle, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function PatientRegistrationModal({ isOpen, onClose, onRegistered }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    bloodGroup: 'B+',
    gender: 'Male',
    dob: '1985-05-15',
    emergencyContactName: '',
    emergencyContactPhone: '',
    chronicConditions: '',
    allergies: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPassport, setNewPassport] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide patient name and email.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'patient',
        phone: formData.phone || '+91 98765 43210',
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        dob: formData.dob,
        emergencyContact: {
          name: formData.emergencyContactName || 'Family Member',
          relation: 'Emergency Contact',
          phone: formData.emergencyContactPhone || formData.phone || '+91 98765 43210',
        },
      };

      const res = await api.register(payload);
      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Switch to this newly registered user
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        
        // Fetch new passport
        const pRes = await api.getMyPassport();
        if (pRes.success) {
          setNewPassport(pRes.passport);
        }

        setTimeout(() => {
          if (onRegistered) onRegistered(res.user);
          onClose();
        }, 2500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Patient Registration & Instant QR Passport
              </h3>
              <p className="text-xs text-slate-500">
                Register a new patient to generate a Digital Health Passport & QR Code
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {newPassport ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Registration Successful!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Generated Universal Health ID: <strong className="font-mono text-teal-700">{newPassport.abhaId}</strong>
              </p>
            </div>

            {newPassport.qrCodeDataUrl && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-sm">
                <img 
                  src={newPassport.qrCodeDataUrl} 
                  alt="New QR Passport" 
                  className="w-36 h-36 mx-auto rounded-lg"
                />
                <span className="text-[11px] font-bold text-slate-600 block mt-1">
                  Your Personal QR Health Passport
                </span>
              </div>
            )}
            <p className="text-xs text-slate-400">Loading your health passport dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anand.kumar@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold"
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
                <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="e.g. Suman Kumar (Spouse)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+91 99887 76655"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                System automatically provisions cryptographic Health Passport upon registration.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                {loading ? 'Registering...' : 'Register & Generate QR Passport'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
