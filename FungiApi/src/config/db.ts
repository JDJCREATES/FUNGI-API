// src/config/db.ts

import mongoose from 'mongoose';
import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';

const connectDB = async (): Promise<void> => {
  try {
    // no options needed in mongoose v6+
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('✔️  MongoDB connected');
  } catch (err: any) {
    logger.err('❌ MongoDB connection error:', err);
    process.exit(1);
  }

  // Optional: handle runtime connection errors
  mongoose.connection.on('error', (err) => {
    logger.err('❌ MongoDB runtime error:', err);
  });
};

export default connectDB;
