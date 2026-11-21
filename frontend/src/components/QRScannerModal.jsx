import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, Upload, X, AlertCircle, FileImage, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'file' | 'manual'
  const [manualHealthId, setManualHealthId] = useState('');
  const [scanningError, setScanningError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  const html5QrCodeRef = useRef(null);

  // Initialize and clean up camera scanner
  useEffect(() => {
    let qrInstance = null;

    if (isOpen && activeMode === 'camera') {
      const containerId = 'qr-reader-viewport';
      
      const startScanner = async () => {
        try {
          qrInstance = new Html5Qrcode(containerId, {
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true,
            },
          });
          html5QrCodeRef.current = qrInstance;

          await qrInstance.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              // Successful QR scan from camera
              stopCamera();
              handleProcessQR(decodedText);
            },
            (errorMessage) => {
              // Frame-by-frame NotFoundExceptions are normal while searching for QR; ignore them completely.
            }
          );
          setCameraActive(true);
          setScanningError(null);
        } catch (err) {
          console.warn('Camera start issue:', err);
          setCameraActive(false);
          // Friendly explanation instead of raw browser exception
          if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
            setScanningError('Camera permission was denied. Please allow camera access in your browser or switch to "Upload QR Image" / "Manual Health ID".');
          } else {
            setScanningError('Live camera is not accessible in this environment. You can upload a QR image or enter the Health ID manually.');
          }
        }
      };

      const timer = setTimeout(startScanner, 200);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeMode]);

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        // Ignore stop errors on unmount
      }
      html5QrCodeRef.current = null;
      setCameraActive(false);
    }
  };

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
      setScanningError(err.message || 'Failed to verify cryptographic QR Code.');
    } finally {
      setLoading(false);
    }
  };

  // File Upload QR Scanning
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setScanningError(null);

    // Show image preview
    const previewUrl = URL.createObjectURL(file);
    setUploadedPreview(previewUrl);

    try {
      // Create temporary dedicated scanner instance for file decode
      const tempScanner = new Html5Qrcode('qr-file-scan-sandbox', {
        experimentalFeatures: { useBarCodeDetectorIfSupported: true }
      });

      const decodedText = await tempScanner.scanFile(file, false);
      tempScanner.clear();

      await handleProcessQR(decodedText);
    } catch (err) {
      const errStr = typeof err === 'string' ? err : err?.message || '';
      console.warn('File scan error:', errStr);

      if (errStr.includes('No MultiFormat Readers') || errStr.includes('NotFoundException')) {
        setScanningError('Could not detect a readable QR code in this image. Please ensure the QR code is centered, well-lit, and not cropped, or enter the Health ID manually.');
      } else {
        setScanningError('Unable to read QR code from this file: ' + (errStr || 'Format unrecognized'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual Health ID lookup
  const handleManualSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!manualHealthId) return;
    setLoading(true);
    setScanningError(null);
    try {
      const res = await api.scanQR({ manualAbhaId: manualHealthId.trim() });
      if (res.success) {
        onScanSuccess(res);
        onClose();
      }
    } catch (err) {
      setScanningError(err.message || 'No patient record found for this Universal Health ID.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
        
        {/* Hidden sandbox container for file scanning without UI artifacts */}
        <div id="qr-file-scan-sandbox" style={{ display: 'none' }}></div>

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
            onClick={() => { stopCamera(); onClose(); }}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl mt-5 text-xs font-bold">
          <button
            onClick={() => { setScanningError(null); setActiveMode('camera'); }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>Live Camera</span>
          </button>
          
          <button
            onClick={() => { stopCamera(); setScanningError(null); setActiveMode('file'); }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileImage className="w-4 h-4 text-emerald-600" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => { stopCamera(); setScanningError(null); setActiveMode('manual'); }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Health ID Lookup</span>
          </button>
        </div>

        {/* Error Notification Alert */}
        {scanningError && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{scanningError}</span>
          </div>
        )}

        {/* TAB 1: Live Camera Scanner */}
        {activeMode === 'camera' && (
          <div className="mt-4 space-y-3">
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 min-h-[260px] flex items-center justify-center">
              {/* Animated Laser Sweep Beam */}
              {cameraActive && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-laser pointer-events-none z-20"></div>
              )}

              {/* Viewport Frame */}
              <div id="qr-reader-viewport" className="w-full text-white z-10">
                {!cameraActive && !loading && (
                  <p className="text-center text-xs text-slate-400 py-12">
                    Requesting camera access...
                  </p>
                )}
                {loading && (
                  <p className="text-center text-xs text-teal-400 font-bold py-12">
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

        {/* TAB 2: Upload Image File (QR Screenshot / Photo) */}
        {activeMode === 'file' && (
          <div className="mt-4 space-y-3">
            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition text-center min-h-[220px]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              {uploadedPreview ? (
                <div className="space-y-2">
                  <img 
                    src={uploadedPreview} 
                    alt="Uploaded QR" 
                    className="max-h-36 rounded-xl mx-auto shadow-sm border border-slate-200" 
                  />
                  <p className="text-xs text-teal-700 font-bold">
                    {loading ? 'Decoding QR image...' : 'Click or drop another image to change'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                    <FileImage className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Choose QR Code Image or Screenshot
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      PNG, JPG, WEBP from patient's passport or phone
                    </span>
                  </div>
                </div>
              )}
            </label>
            <p className="text-center text-[11px] text-slate-400 font-medium">
              Images are decoded client-side and verified against cryptographic signatures.
            </p>
          </div>
        )}

        {/* TAB 3: Manual Health ID Input View */}
        {activeMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Universal Health Identifier (UHID):
              </label>
              <input
                type="text"
                value={manualHealthId}
                onChange={(e) => setManualHealthId(e.target.value)}
                placeholder="e.g. 91-4421-8890-1204"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-lg shadow-teal-600/25 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Querying Universal Health Registry...' : 'Lookup Patient & Request Consent'}
            </button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              If camera or QR image is unavailable, enter the patient's 14-digit UHID directly.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
