import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/errors/api.error';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => {
          return {
            field: err.path.join('.'),
            message: err.message,
          };
        });
        next(new ApiError(400, 'Validation failed', errorMessages));
      } else {
        next(error);
      }
    }
  };
};