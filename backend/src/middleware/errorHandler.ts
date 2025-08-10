import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { z } from 'zod';

export interface ErrorResponse {
  error: string;
  message: string;
  requestId?: string;
  timestamp: string;
  details?: any;
}

/**
 * Global error handler middleware
 */
export function errorHandler(logger: winston.Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] as string;
    const timestamp = new Date().toISOString();

    // Log the error
    logger.error('Unhandled error', {
      requestId: requestId || 'missing',
      url: req.url,
      method: req.method,
      error: err.message,
      stack: err.stack,
      timestamp
    });

    // Handle different types of errors
    if (err instanceof z.ZodError) {
      // Validation errors
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'Invalid request format',
        details: err.errors,
        requestId,
        timestamp
      };
      return res.status(400).json(response);
    }

    if (err.name === 'UnauthorizedError') {
      // Authentication errors
      const response: ErrorResponse = {
        error: 'Unauthorized',
        message: 'Authentication failed',
        requestId,
        timestamp
      };
      return res.status(401).json(response);
    }

    if (err.message.includes('Payment required')) {
      // x402 payment errors
      const response: ErrorResponse = {
        error: 'Payment Required',
        message: 'Valid payment required to access this resource',
        requestId,
        timestamp
      };
      return res.status(402).json(response);
    }

    if (err.message.includes('rate limit')) {
      // Rate limiting errors
      const response: ErrorResponse = {
        error: 'Rate Limited',
        message: 'Too many requests. Please try again later.',
        requestId,
        timestamp
      };
      return res.status(429).json(response);
    }

    // Default to 500 for unknown errors
    const response: ErrorResponse = {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      requestId,
      timestamp
    };

    res.status(500).json(response);
  };
}

/**
 * Async error wrapper to catch promise rejections
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler
 */
export function notFoundHandler() {
  return (req: Request, res: Response) => {
    const requestId = req.headers['x-request-id'] as string;
    const response: ErrorResponse = {
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
      requestId,
      timestamp: new Date().toISOString()
    };
    res.status(404).json(response);
  };
}