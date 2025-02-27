import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/user.model.js';
// import { ApiError } from '../utils/errors/api.error';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Invalid token format',
      })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      const userExists = await User.findOne({ _id: decoded.id });
      if (!userExists) {
        return res.status(401).json({
          message: 'User no longer exists',
        })
      }

      req.user = {
        id: userExists.id,
        email: userExists.email,
        role: userExists.role,
      };

      next();
    } catch (err) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      })
    }
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(res.status(401).json({
        message: 'Authentication required',
      }));
    }

    if (!roles.includes(req.user.role)) {
      return next(res.status(401).json({
        message: 'You do not have permission to perform this action',
      }));
    }

    next();
  };
};