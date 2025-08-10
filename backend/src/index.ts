import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import { agentRoutes } from './routes/agents';
// import { paymentMiddleware } from './middleware/payment';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import { validateEnvironment, logStartupInfo, logEndpoints } from './utils/startup';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-PAYMENT', 'X-PAYMENT-RESPONSE']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(loggerMiddleware(logger));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/ready', async (req, res) => {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'CDP_API_KEY_ID',
      'CDP_API_KEY_SECRET',
      'PAYMENT_ADDRESS',
      'HYPERBOLIC_API_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      return res.status(503).json({ 
        status: 'not ready',
        error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test Hyperbolic API connectivity
    const testResponse = await fetch('https://api.hyperbolic.xyz/v1/models', {
      headers: { Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}` }
    });
    
    if (!testResponse.ok) {
      throw new Error(`Hyperbolic API check failed: ${testResponse.status}`);
    }
    
    res.json({ 
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        hyperbolic: 'healthy',
        cdp: 'configured'
      }
    });
  } catch (error: any) {
    logger.error(`Readiness check failed: ${error.message}`);
    res.status(503).json({ 
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'x402 AI Marketplace API',
    version: '1.0.0',
    description: 'AI agent marketplace with x402 payments',
    endpoints: {
      health: '/health',
      ready: '/ready',
      agents: '/api/agents'
    }
  });
});

// API routes
app.use('/api/agents', agentRoutes);

// Error handling
app.use(errorHandler(logger));

// 404 handler
app.use('*', (req, res) => {
  const requestId = req.headers['x-request-id'] as string;
  
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    requestId: requestId || undefined,
    timestamp: new Date().toISOString()
  });
});

// Start server (only in non-Vercel environments)
if (!process.env.VERCEL) {
  // Log startup info
  logStartupInfo(logger);
  
  // Validate environment
  const missingEnvVars = validateEnvironment(logger);
  if (missingEnvVars.length > 0) {
    logger.warn('⚠️  Server starting with missing environment variables. Some features may not work correctly.');
  }
  
  const server = app.listen(PORT, () => {
    logger.info(`🚀 x402 AI Marketplace API started successfully`, { 
      port: PORT, 
      env: process.env.NODE_ENV || 'development',
      networkId: process.env.NETWORK_ID || 'base-sepolia'
    });
    
    // Log available endpoints
    logEndpoints(logger, Number(PORT));
  });
  
  // Graceful shutdown
  function gracefulShutdown(signal: string) {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close((err) => {
      if (err) {
        logger.error('Error during server shutdown', { error: err.message });
        process.exit(1);
      }
      logger.info('Server closed successfully');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason, promise });
    process.exit(1);
  });
}

export default app;