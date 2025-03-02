import { logger } from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  logger.info({ success: false, status: errStatus, message: errMsg });

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  })
}
