const dns = require('dns');
const mongoose = require('mongoose');

// Ensure SRV records can be resolved reliably across networks and Windows c-ares
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore if custom dns servers cannot be set
}

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}
module.exports = connectDB;
