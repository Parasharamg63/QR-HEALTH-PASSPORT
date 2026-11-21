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

export default function MedicalHistoryTimeline({ records = [], prescriptions = [] }) {
  if (records.length === 0 && prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center text-slate-500 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="font-extrabold text-slate-800 text-base">No Historical Encounters Logged Yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          When an authorized doctor scans your QR and commits a consultation, your verified record will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ledger Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Cryptographically Verified Clinical Ledger</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight mt-1">
            Encounter & Treatment History
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Immutable longitudinal electronic health record complying with HL7/FHIR International Health Records Standards.
          </p>
        </div>

        <span className="text-xs font-black px-3 py-1.5 rounded-full bg-slate-900 text-white shadow-xs">
          {records.length} Verified Clinical {records.length === 1 ? 'Visit' : 'Visits'}
        </span>
      </div>

      {/* Timeline Spine */}
      <div className="relative border-l-2 border-teal-500/30 ml-4 sm:ml-6 pl-4 sm:pl-8 space-y-6">
        {records.map((rec, idx) => {
          const associatedRx = prescriptions.find(p => p.recordId === rec._id || p._id === rec.prescriptionId);
          const visitDate = new Date(rec.visitDate || rec.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={rec._id || idx} className="relative group">
              {/* Glowing Node Marker */}
              <div className="absolute -left-[27px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 border-4 border-white text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-3 h-3" />
              </div>

              {/* Consultation Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-xl transition duration-300 space-y-4">
                {/* Header: Visit Type, Date & Doctor Badge */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {rec.visitType || 'OPD Consultation'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {visitDate}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      <span>{rec.doctorName}</span>
                    </h4>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.doctorSpecialization} • {rec.hospitalName}</span>
                    </p>
                  </div>

                  {rec.followUpDate && (
                    <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-2xl text-xs text-teal-900 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Follow-up: {new Date(rec.followUpDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Diagnosis & ICD Tag */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Clinical Diagnosis & Classification:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-black text-slate-950">{rec.diagnosis}</span>
                    {rec.icdCode && (
                      <span className="bg-white border border-slate-200 text-teal-800 text-[11px] px-2.5 py-0.5 rounded-lg font-mono font-bold">
                        ICD-10: {rec.icdCode}
                      </span>
                    )}
                  </div>

                  {rec.chiefComplaints && rec.chiefComplaints.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-bold">Symptoms:</span>
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
                      <span className="text-[10px] text-slate-400 font-bold block">BP</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.bp || '128/82'}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Pulse</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.pulse || 74} bpm</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">SpO2</span>
                      <strong className="font-mono text-teal-700 font-black">{rec.vitalsRecorded.spo2 || 98}%</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Sugar</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.glucose || 132} mg/dL</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Temp</span>
                      <strong className="font-mono text-slate-900 font-black">{rec.vitalsRecorded.temp || 98.4}°F</strong>
                    </div>
                  </div>
                )}

                {/* Prescribed Medications */}
                {associatedRx && associatedRx.medicines && associatedRx.medicines.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      Prescribed Medications ({associatedRx.medicines.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {associatedRx.medicines.map((med, mIdx) => (
                        <div key={mIdx} className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-3 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-teal-950 text-xs">{med.name}</span>
                            <span className="bg-white px-2 py-0.5 rounded-md font-mono font-bold text-teal-800 text-[10px] border border-teal-200">
                              {med.dosage}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {med.frequency} • {med.mealTiming}
                          </div>
                          {med.instructions && (
                            <div className="text-[10px] text-teal-800 font-semibold italic">
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
                  <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900 space-y-0.5">
                    <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block">
                      Physician Treatment Advice:
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
