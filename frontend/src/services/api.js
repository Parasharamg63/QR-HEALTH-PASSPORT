const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  getDemoUsers: () => request('/auth/demo-users'),
  switchDemo: (payload) => request('/auth/switch-demo', { method: 'POST', body: JSON.stringify(payload) }),

  // Passport
  getMyPassport: () => request('/passport/my-passport'),
  updatePassport: (data) => request('/passport/update', { method: 'PUT', body: JSON.stringify(data) }),
  refreshQR: () => request('/passport/refresh-qr', { method: 'POST' }),
  getPublicEmergencyPassport: (token) => request(`/passport/public/${token}`),

  // Doctor & Consent
  scanQR: (payload) => request('/doctor/scan-qr', { method: 'POST', body: JSON.stringify(payload) }),
  checkSession: (sessionId) => request(`/doctor/active-session/${sessionId}`),
  grantConsent: (payload) => request('/doctor/grant-consent', { method: 'POST', body: JSON.stringify(payload) }),
  getPatientDossier: (patientId, sessionId) => request(`/doctor/patient-dossier/${patientId}${sessionId ? `?sessionId=${sessionId}` : ''}`),

  // Medical Records & Clash Detection
  checkClashes: (payload) => request('/medical/check-clashes', { method: 'POST', body: JSON.stringify(payload) }),
  addTreatment: (payload) => request('/medical/add-treatment', { method: 'POST', body: JSON.stringify(payload) }),
  getMedicalRecords: (patientId) => request(`/medical/records/${patientId}`),
  getPrescriptions: (patientId) => request(`/medical/prescriptions/${patientId}`),

  // Adherence & Medicine Planner
  getTodayDoses: (patientId) => request(`/adherence/today${patientId ? `?patientId=${patientId}` : ''}`),
  markDose: (payload) => request('/adherence/mark-dose', { method: 'POST', body: JSON.stringify(payload) }),
  getAdherenceStats: (patientId) => request(`/adherence/stats/${patientId}`),

  // Caregiver Alerts
  getAlerts: () => request('/alerts'),
  triggerSOS: () => request('/alerts/trigger-sos', { method: 'POST' }),
  resolveAlert: (id) => request(`/alerts/${id}/resolve`, { method: 'PUT' }),
};
