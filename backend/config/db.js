const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qr_health_passport';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error]: ${err.message}`);
    console.info(`[Info] If local mongod is not running, start it with: mongod --dbpath <path> or provide a cloud MONGO_URI in backend/.env`);
    return null;
  }
};

module.exports = connectDB;
