const mongoose = require('mongoose');

const connectDB = async () => {
  // Require MONGO_URI explicitly from environment for connection
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in environment. Aborting MongoDB connection.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
