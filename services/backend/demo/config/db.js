const mongoose = require('mongoose');
require('dotenv').config(); // load environment variables

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`db connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('db connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
