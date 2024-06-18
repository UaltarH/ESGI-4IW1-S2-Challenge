import mongoose from 'mongoose'


async function connectMongoDB(mongoUrl) {
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectMongoDB(process.env.MONGO_URL);