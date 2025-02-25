import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import { app } from './src/app.js';

const PORT = config.port;

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.info('Connected to MongoDB');

    app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});