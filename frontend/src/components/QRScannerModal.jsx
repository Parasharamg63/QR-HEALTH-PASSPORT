import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import { QrCode, Camera, Upload, X, AlertCircle, FileImage, RefreshCw, Video, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

// Multi-Tier QR Decoder (Native BarcodeDetector -> jsQR with Inversion -> Scaled Canvas -> Binarized Contrast)
async function decodeQRFromImageFile(file) {
  // 1. Try Native Browser Hardware BarcodeDetector (Chrome, Edge, Chromium)
  if ('BarcodeDetector' in window) {
    try {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const imageBitmap = await createImageBitmap(file);
      const barcodes = await detector.detect(imageBitmap);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return barcodes[0].rawValue;
      }
    } catch (e) {
      console.warn('Native BarcodeDetector pass:', e);
    }
  }

  // Helper to load image element from file
  const img = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image file.'));
      image.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;

  // 2. jsQR Pass at Native Resolution (supports both light and dark inverted QR codes)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imgData.data, imgData.width, imgData.height, {
      inversionAttempts: 'attemptBoth',
    });
    if (code && code.data) {
      return code.data;
    }
  } catch (e) {
    console.warn('jsQR native pass:', e);
  }

  // 3. High-Resolution Downscale Pass (Scales to 800px sweet spot for mobile 4K screenshots)
  const maxDim = 800;
  if (naturalWidth > maxDim || naturalHeight > maxDim) {
    try {
      const scale = Math.min(maxDim / naturalWidth, maxDim / naturalHeight);
      const scaledCanvas = document.createElement('canvas');
      const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
      scaledCanvas.width = Math.round(naturalWidth * scale);
      scaledCanvas.height = Math.round(naturalHeight * scale);
      scaledCtx.drawImage(img, 0, 0, scaledCanvas.width, scaledCanvas.height);

      const scaledData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
      const code = jsQR(scaledData.data, scaledData.width, scaledData.height, {
        inversionAttempts: 'attemptBoth',
      });
      if (code && code.data) {
        return code.data;
      }
    } catch (e) {
      console.warn('jsQR scaled pass:', e);
    }
  }

  // 4. Binarized Contrast Pass (For low-contrast or glare photos)
  try {
    const contrastCanvas = document.createElement('canvas');
    const contrastCtx = contrastCanvas.getContext('2d', { willReadFrequently: true });
    const targetW = Math.min(naturalWidth, 900);
    const targetH = Math.min(naturalHeight, 900);
    contrastCanvas.width = targetW;
    contrastCanvas.height = targetH;
    contrastCtx.drawImage(img, 0, 0, targetW, targetH);

    const cImgData = contrastCtx.getImageData(0, 0, targetW, targetH);
    const d = cImgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const brightness = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const val = brightness > 128 ? 255 : 0;
      d[i] = val;
      d[i + 1] = val;
      d[i + 2] = val;
    }
    contrastCtx.putImageData(cImgData, 0, 0);

    const code = jsQR(cImgData.data, targetW, targetH, {
      inversionAttempts: 'attemptBoth',
    });
    if (code && code.data) {
      return code.data;
    }
  } catch (e) {
    console.warn('jsQR binarized pass:', e);
  }

  return null;
}

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
    await stopCamera();

    setStartingCamera(true);
    setScanningError(null);

    try {
      const qrInstance = new Html5Qrcode(containerId, {
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      });
      html5QrCodeRef.current = qrInstance;

      const cameraConfig = camId ? camId : { facingMode: 'user' };

      await qrInstance.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
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
        // Safe ignore
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

  // Image File Upload Multi-Tier QR Decoding
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setScanningError(null);

    const previewUrl = URL.createObjectURL(file);
    setUploadedPreview(previewUrl);

    try {
      // Run robust multi-tier decoder (BarcodeDetector -> jsQR normal/inverted -> downscaled -> contrast)
      const decodedText = await decodeQRFromImageFile(file);

      if (decodedText) {
        await handleProcessQR(decodedText);
      } else {
        // Fallback: try Html5Qrcode.scanFile
        const tempScanner = new Html5Qrcode('qr-file-scan-sandbox', {
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        });
        const fallbackText = await tempScanner.scanFile(file, false);
        tempScanner.clear();

        if (fallbackText) {
          await handleProcessQR(fallbackText);
        } else {
          throw new Error('No readable QR code found');
        }
      }
    } catch (err) {
      console.warn('QR file decoding error:', err);
      setScanningError('Could not detect a clear QR code in this image. Please ensure the QR code is centered, well-lit, and not cropped, or enter the patient\'s Universal Health ID directly.');
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
            <div className="w-11 h-11 rounded-2xl bg-[#111111] text-[#00A4A6] flex items-center justify-center shadow-xs border border-slate-800">
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
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeMode === 'camera' ? 'bg-[#111111] text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-[#00A4A6]" />
            <span>Live Camera</span>
          </button>
          
          <button
            onClick={() => { stopCamera(); setScanningError(null); setActiveMode('file'); }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeMode === 'file' ? 'bg-[#111111] text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileImage className="w-4 h-4 text-emerald-400" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => { stopCamera(); setScanningError(null); setActiveMode('manual'); }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeMode === 'manual' ? 'bg-[#111111] text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-slate-300" />
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
                  className="mt-2 text-xs font-bold text-rose-900 underline hover:text-rose-950 flex items-center gap-1 cursor-pointer"
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
                  <Video className="w-3.5 h-3.5 text-blue-700" />
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
              {/* Clinical viewfinder targeting guide */}
              {cameraActive && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-laser pointer-events-none z-20"></div>
              )}

              {/* Status overlay */}
              {startingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 text-slate-300 text-xs gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="font-bold">Opening camera stream...</span>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 text-blue-300 text-xs gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
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
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/40 transition text-center min-h-[220px]">
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
                  <p className="text-xs text-blue-700 font-bold">
                    {loading ? 'Decoding QR image with multi-tier engine...' : 'Click or drop another image to change'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
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
              Decoded with multi-tier hardware acceleration, resolution scaling, and inversion detection.
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
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#111111] hover:bg-black text-white font-black text-xs shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
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
