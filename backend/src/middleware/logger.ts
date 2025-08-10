import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export function loggerMiddleware(logger: winston.Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] as string || generateRequestId();
    
    // Add request ID to headers for downstream services
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    // Log request start
    logger.info('Request started', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    });

    // Log response completion
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Determine log level based on status code
      let level: string;
      if (statusCode >= 500) {
        level = 'error';
      } else if (statusCode >= 400) {
        level = 'warn';
      } else {
        level = 'info';
      }

      // Log response
      logger[level as keyof winston.Logger]('Request completed', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode,
        duration,
        contentLength: res.getHeader('content-length') || 0
      });
    });

    next();
  };
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract request ID from request
 */
export function getRequestId(req: Request): string {
  return req.headers['x-request-id'] as string || 'unknown';
}