const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

async function verifyDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qr_health_passport';
  console.log('Connecting to MongoDB URI:', uri);
  
  await mongoose.connect(uri);
  console.log('Connected successfully!');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  console.log('\n================ DATABASE SUMMARY ================');
  console.log('Database Name:', db.databaseName);
  console.log('Total Collections:', collections.length);
  console.log('--------------------------------------------------');

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const count = await db.collection(colName).countDocuments();
    console.log(`Collection: ${colName.padEnd(20)} | Documents: ${count}`);
    
    const sample = await db.collection(colName).findOne();
    if (sample) {
      const fields = Object.keys(sample).filter(k => k !== '__v');
      console.log(`  Fields: [${fields.join(', ')}]`);
    }
  }
  console.log('==================================================\n');

  await mongoose.disconnect();
}

verifyDatabase().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
