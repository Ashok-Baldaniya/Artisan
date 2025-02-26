import { logger } from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  console.log('------', err);

  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  })
}
