import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(import.meta.dirname, '../../.env') });

export const config = {
  domain: process.env.DOMAIN || 'http://localhost:5000',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
  jwtSecret: process.env.JWT_SECRET || 'test',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  cloudStorage: {
    provider: process.env.STORAGE_PROVIDER || 'aws',
    bucketName: process.env.STORAGE_BUCKET || 'artisan-marketplace',
    region: process.env.STORAGE_REGION || 'us-east-1',
  },
  email: {
    emailFrom: process.env.EMAIL_FROM || 'noreply@artisanmarket.com',
    emailPassword: process.env.EMAIL_PASSWORD || 'Artisan Marketplace',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
};