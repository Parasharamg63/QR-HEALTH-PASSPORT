import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, Upload, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'manual'
  const [manualAbha, setManualAbha] = useState('');
  const [scanningError, setScanningError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let scanner = null;
    if (isOpen && activeMode === 'camera') {
      const timer = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            'qr-reader-container',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
          );

          scanner.render(
            async (decodedText) => {
              if (scanner) scanner.clear();
              handleProcessQR(decodedText);
            },
            (error) => {
              // Ignore frame-by-frame decode attempts
            }
          );
        } catch (err) {
          setScanningError('Camera access unavailable or blocked in this environment: ' + err.message);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          try {
            scanner.clear();
          } catch (e) {}
        }
      };
    }
  }, [isOpen, activeMode]);

  const handleProcessQR = async (qrPayload) => {
    setLoading(true);
    setScanningError(null);
    try {
      const res = await api.scanQR({ qrPayload });
      if (res.success) {
        onScanSuccess(res);
        onClose();
      }
    } catch (err) {
      setScanningError(err.message || 'Failed to verify QR Code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!manualAbha) return;
    setLoading(true);
    setScanningError(null);
    try {
      const res = await api.scanQR({ manualAbhaId: manualAbha.trim() });
      if (res.success) {
        onScanSuccess(res);
        onClose();
      }
    } catch (err) {
      setScanningError(err.message || 'No patient record found for this ABHA ID');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = (abhaId) => {
    setManualAbha(abhaId);
    api.scanQR({ manualAbhaId: abhaId }).then((res) => {
      if (res.success) {
        onScanSuccess(res);
        onClose();
      }
    }).catch(err => setScanningError(err.message));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Patient QR Scanner</h3>
              <p className="text-xs text-slate-500">Scan or enter Health Passport for clinical access</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('camera')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeMode === 'camera' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>Camera Scanner</span>
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeMode === 'manual' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Manual ABHA Entry</span>
          </button>
        </div>

        {/* Error Alert */}
        {scanningError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{scanningError}</span>
          </div>
        )}

        {/* Camera Scanner View */}
        {activeMode === 'camera' && (
          <div className="mt-4">
            <div 
              id="qr-reader-container" 
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 min-h-[260px] flex items-center justify-center"
            >
              {loading && <p className="text-xs text-slate-500 font-medium">Verifying cryptographic token...</p>}
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Position patient's Health Passport QR code within the viewfinder.
            </p>
          </div>
        )}

        {/* Manual ABHA Input View */}
        {activeMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Patient's 14-Digit ABHA ID:
              </label>
              <input
                type="text"
                value={manualAbha}
                onChange={(e) => setManualAbha(e.target.value)}
                placeholder="e.g. 91-4421-8890-1204"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !manualAbha}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Lookup Patient Passport'}
            </button>
          </form>
        )}

        {/* Quick Demo Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            1-Click Demo Patient Quick Select:
          </span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect('91-4421-8890-1204')}
              className="w-full text-left p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 transition text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800">Rameshwar Gowda (68 yrs, Male)</span>
                <span className="block text-slate-500 font-mono text-[10px]">ABHA: 91-4421-8890-1204 • Diabetes & HTN</span>
              </div>
              <span className="text-teal-700 font-bold text-[11px] bg-white px-2 py-0.5 rounded shadow-xs">
                Select →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoSelect('91-3819-2041-9921')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800">Priya Sharma (28 yrs, Female)</span>
                <span className="block text-slate-500 font-mono text-[10px]">ABHA: 91-3819-2041-9921 • Asthma & Penicillin Allergy</span>
              </div>
              <span className="text-slate-600 font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                Select →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
