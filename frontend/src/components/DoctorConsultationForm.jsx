import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Stethoscope, 
  Pill, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Activity, 
  FileText, 
  Save, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_MEDICINES = [
  {
    name: 'Metformin Sustained Release',
    dosage: '500 mg',
    frequency: 'Twice Daily (1-0-1)',
    mealTiming: 'After Food',
    instructions: 'Take immediately after morning breakfast and dinner.',
  },
  {
    name: 'Telmisartan Tablets IP',
    dosage: '40 mg',
    frequency: 'Once Daily (1-0-0)',
    mealTiming: 'After Food',
    instructions: 'Take daily at 09:00 AM for BP control.',
  },
];

export default function DoctorConsultationForm({ patient, sessionId, onTreatmentSaved }) {
  const [chiefComplaints, setChiefComplaints] = useState('Routine 3-month follow-up, mild lethargy, blood pressure monitoring');
  const [diagnosis, setDiagnosis] = useState('Type 2 Diabetes Mellitus with Essential Hypertension');
  const [icdCode, setIcdCode] = useState('E11.9 / I10');
  const [clinicalObservations, setClinicalObservations] = useState('Heart sounds normal S1/S2 audible. No murmurs. Chest clear to auscultation. Bilateral pedal pulses palpable. No pedal edema.');
  const [treatmentPlan, setTreatmentPlan] = useState('Maintain low-glycemic, low-sodium diabetic diet. Continue brisk walking 30 mins daily. Monitor fasting glucose twice weekly.');
  const [followUpDate, setFollowUpDate] = useState('2026-12-25');
  const [investigationsOrdered, setInvestigationsOrdered] = useState('HbA1c, Serum Creatinine, Fasting Lipid Profile');

  // Vitals
  const [vitals, setVitals] = useState({
    bp: '128/82',
    pulse: '74',
    spo2: '98',
    temp: '98.4',
    glucose: '132',
  });

  // Prescriptions
  const [medicines, setMedicines] = useState(DEFAULT_MEDICINES);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        dosage: '10 mg',
        frequency: 'Once Daily (1-0-0)',
        mealTiming: 'After Food',
        instructions: '',
      },
    ]);
  };

  const removeMedicineRow = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      alert('Please provide a clinical diagnosis.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patientId: patient?._id || patient?.id,
        sessionId,
        chiefComplaints: chiefComplaints.split(',').map(s => s.trim()),
        diagnosis,
        clinicalObservations,
        vitalsRecorded: vitals,
        investigationsOrdered: investigationsOrdered.split(',').map(s => s.trim()),
        treatmentPlan,
        followUpDate,
        medicines,
      };

      const res = await api.addTreatment(payload);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          if (onTreatmentSaved) onTreatmentSaved();
        }, 1600);
      }
    } catch (err) {
      alert('Failed to record treatment: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
            Clinical Treatment & Medical Record Update
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Doctor Clinical Consultation
          </h3>
          <p className="text-xs text-slate-500">
            Active patient: <strong className="text-slate-800">{patient?.name}</strong> (ABHA: {patient?.abhaId})
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Consent Verified & Active
        </span>
      </div>

      {/* Vitals Recording Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          Record Patient Clinical Vitals:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-slate-500 block mb-1">Blood Pressure (mmHg)</label>
            <input
              type="text"
              value={vitals.bp}
              onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              placeholder="120/80"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Heart Rate (bpm)</label>
            <input
              type="number"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              placeholder="72"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">SpO2 Oxygen (%)</label>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-emerald-700"
              placeholder="98"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              value={vitals.glucose}
              onChange={(e) => setVitals({ ...vitals, glucose: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-amber-700"
              placeholder="110"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Temperature (°F)</label>
            <input
              type="number"
              step="0.1"
              value={vitals.temp}
              onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              placeholder="98.6"
            />
          </div>
        </div>
      </div>

      {/* Diagnosis & Examination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Chief Complaints / Reason for Visit:</label>
          <input
            type="text"
            value={chiefComplaints}
            onChange={(e) => setChiefComplaints(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            placeholder="e.g. Chest pain, high sugar, routine checkup..."
            required
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis & ICD-10 Tag:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
              placeholder="Primary Diagnosis (e.g. Type 2 Diabetes Mellitus)"
              required
            />
            <input
              type="text"
              value={icdCode}
              onChange={(e) => setIcdCode(e.target.value)}
              className="w-24 px-2 py-2 rounded-xl border border-slate-300 font-mono text-center font-bold text-slate-600"
              placeholder="ICD-10"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="font-bold text-slate-700 block mb-1">Physical Examination & Clinical Observations:</label>
          <textarea
            rows={2}
            value={clinicalObservations}
            onChange={(e) => setClinicalObservations(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            placeholder="Clinical observations, chest findings, cardiovascular examination..."
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Investigations / Lab Tests Ordered:</label>
          <input
            type="text"
            value={investigationsOrdered}
            onChange={(e) => setInvestigationsOrdered(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            placeholder="e.g. HbA1c, Serum Creatinine, ECG..."
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Recommended Follow-up Date:</label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-bold text-slate-700 block mb-1">Treatment Plan, Physician Advice & Diet Guidance:</label>
          <textarea
            rows={2}
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900"
            placeholder="Lifestyle guidance, precautions, emergency warning signs..."
          />
        </div>
      </div>

      {/* Prescribed Medications Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <h4 className="font-bold text-sm text-slate-900">
              Prescription Orders
            </h4>
          </div>

          <button
            type="button"
            onClick={addMedicineRow}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>

        {/* Medicines List */}
        <div className="space-y-2.5">
          {medicines.map((med, mIdx) => (
            <div key={mIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4">
                <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Medicine Name & Strength</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedicine(mIdx, 'name', e.target.value)}
                  placeholder="e.g. Metformin 500mg SR"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Dosage</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(mIdx, 'dosage', e.target.value)}
                  placeholder="500 mg"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Frequency</label>
                <select
                  value={med.frequency}
                  onChange={(e) => updateMedicine(mIdx, 'frequency', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium"
                >
                  <option value="Once Daily (1-0-0)">Once Daily (Morning)</option>
                  <option value="Twice Daily (1-0-1)">Twice Daily (Morning-Night)</option>
                  <option value="Thrice Daily (1-1-1)">Thrice Daily (M-A-N)</option>
                  <option value="Bedtime (0-0-0-1)">Bedtime Only (Night)</option>
                  <option value="As Needed (SOS)">As Needed (SOS)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Meal Timing</label>
                <select
                  value={med.mealTiming}
                  onChange={(e) => updateMedicine(mIdx, 'mealTiming', e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium"
                >
                  <option value="After Food">After Food</option>
                  <option value="Before Food (Empty Stomach)">Before Food</option>
                  <option value="With Food">With Food</option>
                  <option value="Bedtime">Bedtime</option>
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeMedicineRow(mIdx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          This treatment will be immutably recorded in the patient's Health Passport history.
        </span>

        <button
          type="submit"
          disabled={saving || saveSuccess}
          className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Medical History Updated Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{saving ? 'Recording Treatment...' : 'Give Treatment & Update Medical History'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
