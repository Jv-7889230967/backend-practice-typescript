import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: ApiError | Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
):void=> {
  if (err instanceof ApiError) {
     res.status(err.statusCode).json({
      success: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle generic server errors
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
