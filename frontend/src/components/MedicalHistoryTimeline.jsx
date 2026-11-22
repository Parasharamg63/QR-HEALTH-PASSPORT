import React from 'react';
import { 
  Calendar, 
  Stethoscope, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Pill, 
  Building2, 
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MedicalHistoryTimeline({ records = [], prescriptions = [] }) {
  const { t } = useLanguage();

  if (records.length === 0 && prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center text-slate-500 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="font-extrabold text-slate-800 text-base">{t('noEncountersYet')}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {t('noEncountersDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ledger Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F7F8] border border-[#B2E5E8] text-[#005F66] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00838C]" />
            <span>{t('verifiedLedger')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1">
            {t('encounterHistory')}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('ledgerStandardNote')}
          </p>
        </div>

        <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#111111] text-white shadow-xs">
          {records.length} {t('verifiedVisits')}
        </span>
      </div>

      {/* Timeline Spine */}
      <div className="relative border-l-2 border-slate-300 ml-4 sm:ml-6 pl-4 sm:pl-8 space-y-6">
        {records.map((rec, idx) => {
          const associatedRx = prescriptions.find(p => p.recordId === rec._id || p._id === rec.prescriptionId);
          const visitDate = new Date(rec.visitDate || rec.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={rec._id || idx} className="relative group">
              {/* Node Marker */}
              <div className="absolute -left-[27px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#111111] border-4 border-white text-[#00A4A6] flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
              </div>

              {/* Consultation Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                {/* Header: Visit Type, Date & Doctor Badge */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {rec.visitType || 'OPD Consultation'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {visitDate}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[#00838C]" />
                      <span>{rec.doctorName}</span>
                    </h4>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.doctorSpecialization} • {rec.hospitalName}</span>
                    </p>
                  </div>

                  {rec.followUpDate && (
                    <div className="bg-[#E6F7F8] border border-[#B2E5E8] px-3 py-1.5 rounded-2xl text-xs text-[#005F66] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00838C]" />
                      <span>{t('followUp')} {new Date(rec.followUpDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Diagnosis & ICD Tag */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {t('diagnosisTitle')}:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-black text-slate-950">{rec.diagnosis}</span>
                    {rec.icdCode && (
                      <span className="bg-white border border-slate-200 text-slate-800 text-[11px] px-2.5 py-0.5 rounded-lg font-mono font-bold">
                        ICD-10: {rec.icdCode}
                      </span>
                    )}
                  </div>

                  {rec.chiefComplaints && rec.chiefComplaints.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-bold">{t('symptoms')}</span>
                      {rec.chiefComplaints.map((c, i) => (
                        <span key={i} className="bg-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-slate-700 border border-slate-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vitals Recorded at Visit */}
                {rec.vitalsRecorded && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">{t('bp')}</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.bp || '120/80'}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">{t('pulse')}</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.pulse || 72} bpm</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">{t('spo2')}</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.spo2 || 98}%</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">{t('glucose')}</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.glucose || 120} mg/dL</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">{t('temp')}</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.temp || 98.6}°F</strong>
                    </div>
                  </div>
                )}

                {/* Prescribed Medications */}
                {associatedRx && associatedRx.medicines && associatedRx.medicines.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-blue-700" />
                      {t('prescribedMeds')} ({associatedRx.medicines.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {associatedRx.medicines.map((med, mIdx) => (
                        <div key={mIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900 text-xs">{med.name}</span>
                            <span className="bg-white px-2 py-0.5 rounded-md font-mono font-bold text-slate-700 text-[10px] border border-slate-300">
                              {med.dosage}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {med.frequency} • {med.mealTiming}
                          </div>
                          {med.instructions && (
                            <div className="text-[10px] text-slate-600 font-semibold italic">
                              "{med.instructions}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Advice / Instructions */}
                {rec.treatmentPlan && (
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 space-y-0.5">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                      {t('physicianAdvice')}
                    </span>
                    <p className="leading-relaxed font-medium">{rec.treatmentPlan}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
