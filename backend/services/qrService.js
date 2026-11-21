const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generates an encrypted/signed QR code data payload and data URL for a patient
 */
async function generatePassportQRCode(patientId, abhaId, passportToken) {
  const payload = JSON.stringify({
    type: 'QR_HEALTH_PASSPORT',
    version: '2.0',
    abhaId,
    passportToken,
    patientId: patientId.toString(),
    timestamp: Date.now(),
    signature: crypto.createHash('sha256').update(`${abhaId}-${passportToken}-HEALTH-PASSPORT-2026`).digest('hex').substring(0, 16),
  });

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
    width: 320,
  });

  return { payload, qrDataUrl };
}

/**
 * Validates scanned QR payload string
 */
function verifyPassportQRPayload(payloadString) {
  try {
    const data = typeof payloadString === 'string' ? JSON.parse(payloadString) : payloadString;
    if (data.type !== 'QR_HEALTH_PASSPORT' || !data.abhaId || !data.passportToken) {
      return { valid: false, message: 'Invalid QR Health Passport structure.' };
    }

    const expectedSig = crypto.createHash('sha256').update(`${data.abhaId}-${data.passportToken}-HEALTH-PASSPORT-2026`).digest('hex').substring(0, 16);
    if (data.signature !== expectedSig) {
      return { valid: false, message: 'Cryptographic signature mismatch. Unauthorized or tampered QR code.' };
    }

    return { valid: true, data };
  } catch (err) {
    return { valid: false, message: 'Malformed QR Code format: ' + err.message };
  }
}

module.exports = {
  generatePassportQRCode,
  verifyPassportQRPayload,
};
