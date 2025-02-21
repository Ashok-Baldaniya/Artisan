import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import User from '../models/customer.model';
import { UserRole } from '../types/models/user.interface';
import { ApiError } from '../utils/errors/api.error';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Invalid token format');
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      
      // Check if user still exists in database
      const userExists = await User.exists({ _id: decoded.id });
      if (!userExists) {
        throw new ApiError(401, 'User no longer exists');
      }
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      
      next();
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    
    next();
  };
};