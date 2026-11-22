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
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Lock,
  Clock,
  ClipboardList
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
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

  const handleApplyPreset = (type) => {
    if (type === 'diabetes') {
      setDiagnosis('Type 2 Diabetes Mellitus with Dyslipidemia');
      setIcdCode('E11.9 / E78.5');
      setMedicines([
        {
          name: 'Metformin Sustained Release',
          dosage: '500 mg',
          frequency: 'Twice Daily (1-0-1)',
          mealTiming: 'After Food',
          instructions: 'Take immediately with meals to minimize gastric distress.',
        },
        {
          name: 'Atorvastatin IP',
          dosage: '10 mg',
          frequency: 'Once Daily (0-0-1)',
          mealTiming: 'After Food',
          instructions: 'Take at bedtime.',
        },
      ]);
    } else if (type === 'hypertension') {
      setDiagnosis('Primary Essential Hypertension');
      setIcdCode('I10');
      setMedicines([
        {
          name: 'Amlodipine Tablets IP',
          dosage: '5 mg',
          frequency: 'Once Daily (1-0-0)',
          mealTiming: 'After Food',
          instructions: 'Take every morning.',
        },
      ]);
    } else if (type === 'vet') {
      setDiagnosis('Routine Veterinary Health Check & Annual Immunization');
      setIcdCode('Z00.0 / VET-WELLNESS');
      setChiefComplaints('Annual deworming review, rabies & DHPPiL vaccination update, physical exam');
      setClinicalObservations('Animal is alert and active. Shiny coat, clear sclera, normal capillary refill time (<2s). Normal thoracic auscultation.');
      setTreatmentPlan('Administer broad-spectrum deworming tablet with food. Ensure clean fresh water daily. Monitor weight weekly.');
      setInvestigationsOrdered('Fecal Flotation Test, Complete Blood Count (CBC)');
      setMedicines([
        {
          name: 'Fenbendazole / Pyrantel Dewormer Tablet',
          dosage: '500 mg',
          frequency: 'Once Daily (1-0-0)',
          mealTiming: 'With Food',
          instructions: 'Administer with meal for internal parasite protection.',
        },
        {
          name: 'Veterinary Multivitamin & Omega-3 Supplement',
          dosage: '1 Tablet',
          frequency: 'Once Daily (1-0-0)',
          mealTiming: 'After Food',
          instructions: 'For coat health and immune support.',
        },
      ]);
    }
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
          particleCount: 100,
          spread: 70,
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-7">
      {/* Header Clinical Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F7F8] border border-[#B2E5E8] text-[#005F66] text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5 text-[#00838C]" />
            <span>{t('consultationPad')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1.5 flex items-center gap-2.5">
            {t('clinicalExamination')}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('activePatient')}: <strong className="text-slate-900">{patient?.name}</strong> (Health ID: <span className="font-mono text-slate-900">{patient?.abhaId}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {t('consentVerified60m')}
          </span>
        </div>
      </div>

      {/* SECTION 1: Vitals Recording Strip */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-700" />
            {t('recordBiometrics')}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">{t('realtimeTelemetry')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('bp')} (mmHg)
            </label>
            <input
              type="text"
              value={vitals.bp}
              onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-slate-900 text-sm focus:border-blue-600 outline-none"
              placeholder="120/80"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('pulse')} (bpm)
            </label>
            <input
              type="number"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-slate-900 text-sm focus:border-blue-600 outline-none"
              placeholder="72"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('spo2')} (%)
            </label>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-slate-900 text-sm focus:border-blue-600 outline-none"
              placeholder="98"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('glucose')} (mg/dL)
            </label>
            <input
              type="number"
              value={vitals.glucose}
              onChange={(e) => setVitals({ ...vitals, glucose: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-slate-900 text-sm focus:border-blue-600 outline-none"
              placeholder="120"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t('temp')} (°F)
            </label>
            <input
              type="text"
              value={vitals.temp}
              onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-slate-900 text-sm focus:border-blue-600 outline-none"
              placeholder="98.6"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Diagnosis, ICD Tag, and Clinical Observations */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            {t('diagnosisTitle')}
          </label>
          {/* Quick preset chips */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400 font-semibold">{t('quickPresets')}</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('diabetes')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition cursor-pointer"
            >
              {t('diabeticReview')}
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('hypertension')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition cursor-pointer"
            >
              {t('hypertensionReview')}
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('vet')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition cursor-pointer"
            >
              {t('vetReview')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder={t('diagnosisPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              value={icdCode}
              onChange={(e) => setIcdCode(e.target.value)}
              placeholder={t('icdPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('symptomsLabel')}
          </label>
          <input
            type="text"
            value={chiefComplaints}
            onChange={(e) => setChiefComplaints(e.target.value)}
            placeholder={t('symptomsPlaceholder')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('physicianObsLabel')}
          </label>
          <textarea
            rows={2}
            value={clinicalObservations}
            onChange={(e) => setClinicalObservations(e.target.value)}
            placeholder={t('physicianObsPlaceholder')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
          />
        </div>
      </div>

      {/* SECTION 3: Medication Prescription Pad */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-700" />
              {t('prescriptionPad')}
            </label>
            <p className="text-[11px] text-slate-400 font-medium">
              {t('prescriptionSub')}
            </p>
          </div>

          <button
            type="button"
            onClick={addMedicineRow}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition flex items-center gap-1.5 border border-blue-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addMedication')}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {medicines.map((med, idx) => (
            <div key={idx} className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder={t('medNamePlaceholder')}
                  value={med.name}
                  onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder={t('dosagePlaceholder')}
                  value={med.dosage}
                  onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold text-slate-700"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={med.frequency}
                  onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="Once Daily (1-0-0)">Once Daily (1-0-0)</option>
                  <option value="Twice Daily (1-0-1)">Twice Daily (1-0-1)</option>
                  <option value="Thrice Daily (1-1-1)">Thrice Daily (1-1-1)</option>
                  <option value="At Bedtime (0-0-1)">At Bedtime (0-0-1)</option>
                  <option value="As Needed (SOS)">As Needed (SOS)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={med.mealTiming}
                  onChange={(e) => updateMedicine(idx, 'mealTiming', e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="After Food">After Food</option>
                  <option value="Before Food">Before Food</option>
                  <option value="With Food">With Food</option>
                  <option value="Empty Stomach">Empty Stomach</option>
                </select>
              </div>

              <div className="sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeMedicineRow(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Remove medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Treatment Plan, Tests & Follow-Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            {t('orderedInvestigations')}
          </label>
          <input
            type="text"
            value={investigationsOrdered}
            onChange={(e) => setInvestigationsOrdered(e.target.value)}
            placeholder={t('orderedPlaceholder')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-800"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-700" />
            {t('nextFollowUpDate')}
          </label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-bold text-slate-700 block mb-1">
            {t('lifestyleAdviceLabel')}
          </label>
          <textarea
            rows={2}
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder={t('lifestyleAdvicePlaceholder')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-800"
          />
        </div>
      </div>

      {/* SUBMIT BUTTON: Give Treatment & Update Medical History */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-[#111111] hover:bg-black text-white font-black text-sm sm:text-base shadow-sm hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              <span>{t('committingLedger')}</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>{t('treatmentRecordedSuccess')}</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 text-[#00A4A6]" />
              <span>{t('giveTreatmentBtn')}</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
          {t('commitPermanentlyNote')}
        </p>
      </div>
    </form>
  );
}
