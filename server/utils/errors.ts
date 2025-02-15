import { StatusCodes } from 'http-status-codes';

export class BaseError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForecastError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class TriageError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}