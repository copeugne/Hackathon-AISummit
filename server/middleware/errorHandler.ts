import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseError, ForecastError, TriageError } from '../utils/errors.ts';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  if (err instanceof ForecastError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Forecast Error',
      message: err.message
    });
  }

  if (err instanceof TriageError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Triage Error',
      message: err.message
    });
  }

  // Default error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
}