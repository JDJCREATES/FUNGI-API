import mongoose from 'mongoose';
import logger from 'jet-logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fungi-api';
    
    logger.info(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    
    // Log successful connection
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.err('MongoDB connection error:', err);
    
    // Provide more helpful error messages based on common issues
    if (err instanceof Error) {
      if (err.message.includes('ECONNREFUSED')) {
        logger.err('MongoDB connection refused. Is MongoDB running?');
      } else if (err.message.includes('Authentication failed')) {
        logger.err('MongoDB authentication failed. Check your username and password.');
      } else if (err.message.includes('timed out')) {
        logger.err('MongoDB connection timed out. Check your network or MongoDB server status.');
      }
    }
    
    // Rethrow to be caught by the main error handler
    throw err;
  }
};

export default connectDB;
