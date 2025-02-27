import { logger } from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  logger.info({ success: false, status: errStatus, message: errMsg })
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  })
}
