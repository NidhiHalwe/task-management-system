const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/task-manager';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || DEFAULT_LOCAL_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
    return;
  } catch (err) {
    const msg = err.message || err;
    console.error('MongoDB connection error:', msg);

    // Detect common auth errors and provide guidance
    if (msg.toString().toLowerCase().includes('auth') || msg.toString().toLowerCase().includes('authentication')) {
      console.error('\nAuthentication failed when connecting to MongoDB. Possible causes:');
      console.error('- `MONGO_URI` has incorrect username/password.');
      console.error('- MongoDB requires SCRAM auth but credentials are wrong.');
      console.error('- You intended to use a local MongoDB without auth but `MONGO_URI` points to a server that requires credentials.');
      console.error('\nSuggested actions:');
      console.error("1) Verify your connection string in backend/.env (MONGO_URI). Example:\n   MONGO_URI=mongodb://username:password@host:27017/task-manager?authSource=admin");
      console.error("2) If you want to use a local unauthenticated MongoDB for development, unset MONGO_URI so the app uses the local default:\n   mongodb://127.0.0.1:27017/task-manager");
    }

    // If no MONGO_URI was provided, or connection failed, exit so issues are fixed explicitly
    process.exit(1);
  }
};

module.exports = connectDB;
