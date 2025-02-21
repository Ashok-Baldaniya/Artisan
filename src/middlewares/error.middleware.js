import { config } from '../config/env.js';
// import { ApiError } from '../utils/errors/api.error.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  const isDevelopment = config.nodeEnv === 'development';

  logger.error(`${req.method} ${req.path} - Error:`, err);

  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = [];
  let stack;

  // Handle ApiError instances
  if (err) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  }

  // Include stack trace in development
  if (isDevelopment) {
    stack = err.stack;
  }

  // Handle MongoDB unique constraint errors
  if (err.name === 'MongoServerError' && (err).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err).keyValue)[0];
    message = `${field} already exists`;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const validationErrors = err;
    errors = Object.keys(validationErrors.errors).map(key => ({
      field: key,
      message: validationErrors.errors[key].message
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: stack,
  });
};