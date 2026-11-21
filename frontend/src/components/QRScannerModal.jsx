import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, Upload, X, AlertCircle, FileImage, RefreshCw, Video, VideoOff } from 'lucide-react';
import { api } from '../services/api';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'file' | 'manual'
  const [manualHealthId, setManualHealthId] = useState('');
  const [scanningError, setScanningError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState(null);

  const html5QrCodeRef = useRef(null);
  const containerId = 'qr-reader-viewport';

  // Load available camera devices when modal opens
  useEffect(() => {
    if (isOpen) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length > 0) {
            setCameras(devices);
            setSelectedCameraId(devices[0].id);
          }
        })
        .catch((err) => {
          console.warn('Could not list cameras:', err);
        });
    }
  }, [isOpen]);

  // Start or stop live camera depending on mode and modal visibility
  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      const timer = setTimeout(() => {
        startCameraStream(selectedCameraId);
      }, 250);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeMode, selectedCameraId]);

  const startCameraStream = async (camId) => {
    // If already running or starting, stop first
    await stopCamera();

    setStartingCamera(true);
    setScanningError(null);

    try {
      const qrInstance = new Html5Qrcode(containerId, {
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      });
      html5QrCodeRef.current = qrInstance;

      // Select camera: Use device id if available, otherwise try universal constraints
      const cameraConfig = camId ? camId : { facingMode: 'user' };

      await qrInstance.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // QR detected
          stopCamera();
          handleProcessQR(decodedText);
        },
        (errorMessage) => {
          // Normal frame search misses - silent
        }
      );

      setCameraActive(true);
      setStartingCamera(false);
    } catch (err) {
      console.warn('Camera initiation failed:', err);
      setCameraActive(false);
      setStartingCamera(false);

      const msg = err?.message || String(err);
      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        setScanningError('Camera access was blocked by your browser. Please allow camera permissions in your address bar, or use the "Upload Image" / "Health ID" tabs.');
      } else if (msg.includes('OverconstrainedError') || msg.includes('NotFoundException')) {
        setScanningError('Selected camera is not accessible. Try switching cameras or uploading an image of the QR code.');
      } else {
        setScanningError('Unable to open live camera on this device. You can upload a QR image or enter the patient\'s Health ID manually.');
      }
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        // Safe ignore on unmount
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
    setStartingCamera(false);
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

  // Image File Upload QR Decoding
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setScanningError(null);

    const previewUrl = URL.createObjectURL(file);
    setUploadedPreview(previewUrl);

    try {
      const tempScanner = new Html5Qrcode('qr-file-scan-sandbox', {
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      });

      const decodedText = await tempScanner.scanFile(file, false);
      tempScanner.clear();

      await handleProcessQR(decodedText);
    } catch (err) {
      const errStr = typeof err === 'string' ? err : err?.message || '';
      console.warn('File decode error:', errStr);

      if (errStr.includes('No MultiFormat Readers') || errStr.includes('NotFoundException')) {
        setScanningError('Could not detect a readable QR code in this image. Please ensure the QR code is centered, well-lit, and not cropped, or enter the Health ID manually.');
      } else {
        setScanningError('Unable to read QR code from this file: ' + (errStr || 'Format unrecognized'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual Health ID submission
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
        
        {/* Hidden sandbox container for file decoding */}
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
            <div className="flex-1">
              <span className="leading-relaxed block">{scanningError}</span>
              {activeMode === 'camera' && (
                <button
                  type="button"
                  onClick={() => startCameraStream(selectedCameraId)}
                  className="mt-2 text-xs font-bold text-rose-900 underline hover:text-rose-950 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Camera Connection</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: Live Camera Scanner */}
        {activeMode === 'camera' && (
          <div className="mt-4 space-y-3">
            {/* Camera Selector Dropdown if multiple devices exist */}
            {cameras.length > 1 && (
              <div className="flex items-center justify-between text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-teal-600" />
                  Select Device:
                </span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-bold outline-none max-w-[200px] truncate"
                >
                  {cameras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label || `Camera ${c.id.substring(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Video Viewport Frame */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 min-h-[280px]">
              {/* Laser Sweep Animation when scanning */}
              {cameraActive && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-laser pointer-events-none z-20"></div>
              )}

              {/* Status overlay (OUTSIDE the viewport container to avoid React reconciliation wipe) */}
              {startingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 text-slate-300 text-xs gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                  <span className="font-bold">Opening camera stream...</span>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 text-teal-300 text-xs gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                  <span className="font-bold">Verifying cryptographic passport...</span>
                </div>
              )}

              {/* Dedicated pure DOM container for Html5Qrcode video (NO React children inside) */}
              <div id="qr-reader-viewport"></div>
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
