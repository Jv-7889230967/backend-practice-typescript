import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { MulterError } from 'multer';

export const errorHandler = (
  err: ApiError | MulterError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.status,
      message: err.message,
      errors: err.errors,
    });
  }
  else if (err instanceof MulterError) {
    res.status(400).json({
      success: false,
      ErrorType: err.code,
      message: `Multer Error Occurred:${err.message}`
    })
  }

  else {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });

  }
};
