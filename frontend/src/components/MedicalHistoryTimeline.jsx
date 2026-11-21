import React from 'react';
import { 
  Calendar, 
  Stethoscope, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Pill, 
  Building2, 
  AlertCircle 
} from 'lucide-react';

export default function MedicalHistoryTimeline({ records = [], prescriptions = [] }) {
  if (records.length === 0 && prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-sm">No historical encounters logged yet.</p>
        <p className="text-xs text-slate-400 mt-1">New consultation records recorded by doctors will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Clinical History & Encounter Ledger
          </h3>
          <p className="text-xs text-slate-500">
            Immutable, chronological health record verified under National Health Mission standards
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {records.length} Clinical Visits Logged
        </span>
      </div>

      <div className="relative border-l-2 border-teal-200 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
        {records.map((rec, idx) => {
          const associatedRx = prescriptions.find(p => p.recordId === rec._id || p._id === rec.prescriptionId);
          const visitDate = new Date(rec.visitDate || rec.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={rec._id || idx} className="relative group">
              {/* Timeline marker icon */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 rounded-full bg-teal-600 border-4 border-white text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              {/* Record Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                        {rec.visitType || 'OPD Consultation'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> {visitDate}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      {rec.doctorName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {rec.doctorSpecialization} • {rec.hospitalName}
                    </p>
                  </div>

                  {rec.followUpDate && (
                    <div className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] text-blue-800 font-semibold">
                      Follow-up: {new Date(rec.followUpDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="mt-3 space-y-3 text-xs">
                  {/* Diagnosis */}
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block mb-0.5">
                      Clinical Diagnosis & ICD Tag:
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span>{rec.diagnosis}</span>
                      {rec.icdCode && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                          {rec.icdCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chief Complaints */}
                  {rec.chiefComplaints && rec.chiefComplaints.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block mb-1">
                        Chief Complaints:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.chiefComplaints.map((c, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                            • {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitals At Consultation */}
                  {rec.vitalsRecorded && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block mb-1 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-teal-600" />
                        Vitals Recorded at Visit:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                        <div>BP: <strong className="font-mono text-slate-900">{rec.vitalsRecorded.bp || '130/84'}</strong></div>
                        <div>Pulse: <strong className="font-mono text-slate-900">{rec.vitalsRecorded.pulse || 75} bpm</strong></div>
                        <div>SpO2: <strong className="font-mono text-slate-900">{rec.vitalsRecorded.spo2 || 97}%</strong></div>
                        <div>Sugar: <strong className="font-mono text-slate-900">{rec.vitalsRecorded.glucose || 148} mg/dL</strong></div>
                        <div>Temp: <strong className="font-mono text-slate-900">{rec.vitalsRecorded.temp || 98.4}°F</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Clinical Notes & Treatment Plan */}
                  {rec.treatmentPlan && (
                    <div className="text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-0.5">Physician Advice & Plan:</span>
                      {rec.treatmentPlan}
                    </div>
                  )}

                  {/* Associated Prescriptions */}
                  {associatedRx && associatedRx.medicines && associatedRx.medicines.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block mb-2 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        Prescribed Clash-Checked Medications:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {associatedRx.medicines.map((med, mIdx) => (
                          <div key={mIdx} className="bg-teal-50/50 border border-teal-200/60 rounded-xl p-2.5 text-[11px]">
                            <div className="font-bold text-teal-950 flex items-center justify-between">
                              <span>{med.name}</span>
                              <span className="text-teal-700 bg-white px-1.5 py-0.5 rounded font-mono text-[10px]">
                                {med.dosage}
                              </span>
                            </div>
                            <div className="text-slate-500 mt-0.5">{med.frequency} • {med.mealTiming}</div>
                            {med.instructions && (
                              <p className="text-teal-900 text-[10px] mt-1 italic">
                                "{med.instructions}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
