import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, Upload, X, CheckCircle2, AlertCircle, Sparkles, User, Zap } from 'lucide-react';
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
          setScanningError('Camera access unavailable in this environment: ' + err.message);
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
    setLoading(true);
    api.scanQR({ manualAbhaId: abhaId }).then((res) => {
      if (res.success) {
        onScanSuccess(res);
        onClose();
      }
    }).catch(err => setScanningError(err.message))
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Doctor Clinical QR Scanner</h3>
              <p className="text-xs text-slate-500 font-medium">Scan patient Health Passport to request consent</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl mt-5 text-xs font-bold">
          <button
            onClick={() => setActiveMode('camera')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeMode === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>Camera Optical Scanner</span>
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              activeMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Manual ABHA Lookup</span>
          </button>
        </div>

        {/* Error Alert */}
        {scanningError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{scanningError}</span>
          </div>
        )}

        {/* Camera Scanner View */}
        {activeMode === 'camera' && (
          <div className="mt-4 space-y-3">
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 min-h-[260px] flex items-center justify-center">
              {/* Laser Sweep Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-laser pointer-events-none z-20"></div>

              {/* Camera Scanner Container */}
              <div id="qr-reader-container" className="w-full text-white z-10">
                {loading && (
                  <p className="text-center text-xs text-teal-400 font-bold">
                    Verifying cryptographic token...
                  </p>
                )}
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium">
              Point camera at patient's dynamic QR code on screen or printed passport.
            </p>
          </div>
        )}

        {/* Manual ABHA Input View */}
        {activeMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Patient ABHA Health Identifier (14-digit):
              </label>
              <input
                type="text"
                value={manualAbha}
                onChange={(e) => setManualAbha(e.target.value)}
                placeholder="91-4421-8890-1204"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-lg shadow-teal-600/25 transition disabled:opacity-50"
            >
              {loading ? 'Querying ABDM Registry...' : 'Lookup Patient & Request Consent'}
            </button>
          </form>
        )}

        {/* 1-Click Test Simulation Chip */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Instant Test Simulator:
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemoSelect('91-4421-8890-1204')}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                RG
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                  Rameshwar Gowda (Patient)
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ABHA: 91-4421-8890-1204
                </div>
              </div>
            </div>

            <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-teal-600" />
              <span>Simulate Scan</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
