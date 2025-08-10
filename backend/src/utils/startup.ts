import winston from 'winston';

export function validateEnvironment(logger: winston.Logger): string[] {
  const requiredEnvVars = [
    'CDP_API_KEY_ID',
    'CDP_API_KEY_SECRET',
    'PAYMENT_ADDRESS',
    'HYPERBOLIC_API_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables', {
      missing: missingEnvVars,
      note: 'Copy .env.example to .env and fill in the required values'
    });
  } else {
    logger.info('Environment validation passed', {
      configured: requiredEnvVars
    });
  }

  return missingEnvVars;
}

export function logStartupInfo(logger: winston.Logger) {
  logger.info('🚀 x402 AI Marketplace Backend Starting...', {
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    networkId: process.env.NETWORK_ID || 'base-sepolia'
  });
}

export function logEndpoints(logger: winston.Logger, port: number) {
  const baseUrl = `http://localhost:${port}`;
  
  logger.info('📡 Available Endpoints:', {
    health: `${baseUrl}/health`,
    ready: `${baseUrl}/ready`,
    agents: `${baseUrl}/api/agents`,
    agentInvoke: `${baseUrl}/api/agents/:id/invoke (POST, requires x402 payment)`,
    agentDeploy: `${baseUrl}/api/agents/deploy (POST, requires x402 payment)`,
    models: `${baseUrl}/api/agents/models`,
    wallet: `${baseUrl}/api/agents/wallet/info`,
    faucet: `${baseUrl}/api/agents/wallet/fund (POST, testnet only)`
  });
}