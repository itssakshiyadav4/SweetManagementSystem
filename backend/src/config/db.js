const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Mongo URI:', process.env.MONGO_URI);

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

module.exports = connectDB;
