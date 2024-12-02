import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local');
}

export const connectToDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
    
    if (connection.readyState === 1) {
      console.log('MongoDB connected');
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return Promise.reject(error);
  }
}; 