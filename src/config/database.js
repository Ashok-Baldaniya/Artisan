import mongoose from 'mongoose';
import logger from '../utils/logger';
import { config } from './env';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Configure mongoose settings
mongoose.set('debug', config.nodeEnv === 'development');