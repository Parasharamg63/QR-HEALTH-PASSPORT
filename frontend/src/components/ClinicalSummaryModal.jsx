import React from 'react';
import { Printer, X, ShieldCheck, Stethoscope, CheckCircle2 } from 'lucide-react';

export default function ClinicalSummaryModal({ isOpen, onClose, record, patient }) {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const visitDate = new Date(record.visitDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Official Clinical Consultation Summary</h3>
              <p className="text-xs text-slate-500">Certified Digital Clinical Record</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div id="printable-summary" className="mt-5 p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4 text-xs">
          {/* Hospital & Doctor Header */}
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {record.hospitalName || 'Apex Heart & Super-Specialty Institute'}
              </h4>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Attending Physician: {record.doctorName || 'Dr. Rajesh Sharma, MD, DM'}
              </p>
              <p className="text-[11px] text-slate-400">
                Specialization: {record.doctorSpecialization || 'Consultant Cardiologist'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Verified Record
              </span>
              <p className="text-xs text-slate-500 mt-1">Date: {visitDate}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">PATIENT NAME</span>
              <strong className="text-slate-900 font-bold">{patient?.name || 'Rameshwar Gowda'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">HEALTH ID (UHID)</span>
              <strong className="font-mono text-teal-700">{patient?.abhaId || '91-4421-8890-1204'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">BLOOD GROUP</span>
              <strong className="text-rose-600 font-bold">{patient?.bloodGroup || 'B+'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">CONSULTATION</span>
              <strong className="text-slate-700 font-semibold">{record.visitType || 'OPD'}</strong>
            </div>
          </div>

          {/* Clinical Findings */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis:</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{record.diagnosis}</p>
            </div>

            {record.chiefComplaints && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chief Symptoms:</span>
                <p className="text-slate-700">{Array.isArray(record.chiefComplaints) ? record.chiefComplaints.join(', ') : record.chiefComplaints}</p>
              </div>
            )}

            {record.clinicalObservations && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physician Observations:</span>
                <p className="text-slate-600 italic">"{record.clinicalObservations}"</p>
              </div>
            )}

            {record.treatmentPlan && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatment Advice:</span>
                <p className="text-slate-700 font-medium">{record.treatmentPlan}</p>
              </div>
            )}

            {record.followUpDate && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">Scheduled Clinical Follow-up:</span>
                <span className="font-bold text-blue-700">{new Date(record.followUpDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            This record is immutably synchronized to the patient's QR Health Passport.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Clinical Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
