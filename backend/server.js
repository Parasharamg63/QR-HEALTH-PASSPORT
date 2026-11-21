const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment config
dotenv.config();

const app = express();

// Initialize DB connection
connectDB();

// Core Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'QR Health Passport Core API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (Strictly mapped to Prompt)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/passport', require('./routes/passportRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  QR HEALTH PASSPORT BACKEND RUNNING ON PORT ${PORT}  `);
  console.log(`  API Base URL: http://localhost:${PORT}/api            `);
  console.log(`=======================================================`);
});
