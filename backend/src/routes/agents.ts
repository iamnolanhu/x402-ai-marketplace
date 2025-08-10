import { Router } from 'express';
import winston from 'winston';
import { AIService, AgentInvokeSchema, AgentDeploySchema } from '../services/aiService';
import { WalletService } from '../services/walletService';
import { createPaymentMiddleware, extractPaymentInfo } from '../middleware/payment';
import { asyncHandler } from '../middleware/errorHandler';
import { getRequestId } from '../middleware/logger';
import { SUPPORTED_NETWORKS, getSupportedNetworkIds } from '../config/networks';

const router = Router();

// Initialize services
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

const aiService = new AIService(logger);
const walletService = new WalletService(logger);

// Initialize wallet on startup
walletService.initializeWallet().catch(error => {
  logger.error('Failed to initialize wallet service', { error: error.message });
});

/**
 * GET /api/agents
 * Get all available agents
 */
router.get('/', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  
  try {
    const agents = aiService.getAgents();
    
    logger.info('Agents list retrieved', { 
      requestId, 
      count: agents.length 
    });
    
    res.json({
      agents,
      total: agents.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get agents list', { requestId, error: error.message });
    throw error;
  }
}));

/**
 * GET /api/agents/networks
 * Get supported networks configuration
 */
router.get('/networks', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  
  try {
    const networks = Object.values(SUPPORTED_NETWORKS).map(network => ({
      id: network.id,
      name: network.name,
      chainId: network.chainId,
      chainIdHex: network.chainIdHex,
      isTestnet: network.isTestnet,
      nativeCurrency: network.nativeCurrency,
      faucetUrls: network.faucetUrls
    }));
    
    logger.info('Supported networks retrieved', { 
      requestId, 
      count: networks.length 
    });
    
    res.json({
      networks,
      count: networks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get supported networks', { requestId, error: error.message });
    throw error;
  }
}));

/**
 * GET /api/agents/models
 * Get available AI models
 */
router.get('/models', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  
  try {
    const models = await aiService.getAvailableModels(requestId);
    
    logger.info('Available models retrieved', { 
      requestId, 
      count: models.length 
    });
    
    res.json({
      models,
      count: models.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get available models', { requestId, error: error.message });
    throw error;
  }
}));

/**
 * GET /api/agents/:id
 * Get specific agent details
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  const agentId = req.params.id;
  
  try {
    const agent = aiService.getAgent(agentId);
    
    if (!agent) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent ${agentId} not found`,
        requestId,
        timestamp: new Date().toISOString()
      });
    }
    
    logger.info('Agent details retrieved', { requestId, agentId });
    
    res.json({
      agent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get agent details', { requestId, agentId, error: error.message });
    throw error;
  }
}));

/**
 * POST /api/agents/:id/invoke
 * Invoke an agent (requires x402 payment)
 */
router.post('/:id/invoke', 
  extractPaymentInfo(),
  asyncHandler(async (req, res, next) => {
    // Apply payment middleware
    const paymentMiddleware = createPaymentMiddleware(logger);
    
    return new Promise<void>((resolve, reject) => {
      paymentMiddleware(req, res, (err) => {
        if (err) {
          logger.error('Payment middleware error', { 
            requestId: getRequestId(req),
            agentId: req.params.id,
            error: err.message
          });
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(() => next()).catch(next);
  }),
  asyncHandler(async (req, res) => {
    const requestId = getRequestId(req);
    const agentId = req.params.id;
    
    try {
      // Validate request body
      const validatedRequest = AgentInvokeSchema.parse(req.body);
      
      // Get agent to check if it exists
      const agent = aiService.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Agent ${agentId} not found`,
          requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      // Invoke the agent
      const result = await aiService.invokeAgent(agentId, validatedRequest, requestId);
      
      logger.info('Agent invoked successfully', { 
        requestId, 
        agentId,
        inputLength: validatedRequest.input.length,
        model: result.model
      });
      
      res.json({
        success: true,
        result,
        agent: {
          id: agent.id,
          name: agent.name
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Agent invocation failed', { 
        requestId, 
        agentId,
        error: error.message 
      });
      throw error;
    }
  })
);

/**
 * POST /api/agents/deploy
 * Deploy a new agent (requires x402 payment)
 */
router.post('/deploy',
  extractPaymentInfo(),
  asyncHandler(async (req, res, next) => {
    // Apply payment middleware for deployment
    const paymentMiddleware = createPaymentMiddleware(logger);
    
    return new Promise<void>((resolve, reject) => {
      paymentMiddleware(req, res, (err) => {
        if (err) {
          logger.error('Payment middleware error for deployment', { 
            requestId: getRequestId(req),
            error: err.message
          });
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(() => next()).catch(next);
  }),
  asyncHandler(async (req, res) => {
    const requestId = getRequestId(req);
    
    try {
      // Validate request body
      const validatedRequest = AgentDeploySchema.parse(req.body);
      
      // Deploy the agent
      const agent = await aiService.deployAgent(validatedRequest, 'user'); // In production, get from auth
      
      logger.info('Agent deployed successfully', { 
        requestId,
        agentId: agent.id,
        name: agent.name,
        model: agent.model
      });
      
      res.status(201).json({
        success: true,
        agent,
        message: 'Agent deployed successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Agent deployment failed', { 
        requestId,
        error: error.message 
      });
      throw error;
    }
  })
);


/**
 * GET /api/agents/wallet/info
 * Get wallet information
 */
router.get('/wallet/info', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  const networkId = req.query.network as string;
  
  try {
    let walletInfo;
    if (networkId) {
      // Create wallet service instance for specific network
      const networkWalletService = new WalletService(logger, networkId);
      walletInfo = await networkWalletService.getWalletInfo();
    } else {
      walletInfo = await walletService.getWalletInfo();
    }
    
    logger.info('Wallet info retrieved', { 
      requestId,
      networkId: networkId || 'default',
      walletId: walletInfo.id,
      address: walletInfo.address
    });
    
    res.json({
      wallet: walletInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get wallet info', { requestId, networkId, error: error.message });
    throw error;
  }
}));

/**
 * GET /api/agents/wallet/network/:networkId
 * Get wallet information for specific network (alternative endpoint)
 */
router.get('/wallet/network/:networkId', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  const networkId = req.params.networkId;
  
  try {
    // Create wallet service instance for specific network
    const networkWalletService = new WalletService(logger, networkId);
    const walletInfo = await networkWalletService.getWalletInfo();
    
    logger.info('Network-specific wallet info retrieved', { 
      requestId,
      networkId,
      walletId: walletInfo.id,
      address: walletInfo.address
    });
    
    res.json({
      wallet: walletInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get network-specific wallet info', { requestId, networkId, error: error.message });
    throw error;
  }
}));

/**
 * POST /api/agents/wallet/fund
 * Fund wallet via faucet (testnet only)
 */
router.post('/wallet/fund', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  
  try {
    const transactionHash = await walletService.fundWallet();
    
    logger.info('Wallet funded successfully', { 
      requestId,
      transactionHash
    });
    
    res.json({
      success: true,
      transactionHash,
      message: 'Wallet funded successfully via faucet',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to fund wallet', { requestId, error: error.message });
    throw error;
  }
}));

/**
 * POST /api/agents/transaction-log
 * Log transaction confirmations (webhook endpoint for x402)
 */
router.post('/transaction-log', asyncHandler(async (req, res) => {
  const requestId = getRequestId(req);
  
  if (!requestId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'X-Request-ID header is required for request correlation',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    const transactionHash = req.headers['x-transaction-hash'] as string;
    const paymentNetwork = req.headers['x-payment-network'] as string;
    const payerAddress = req.headers['x-payer-address'] as string;
    
    logger.info('Transaction confirmed', {
      requestId,
      transaction: transactionHash,
      network: paymentNetwork,
      payer: payerAddress,
      agentId: req.body?.agentId,
      amount: req.body?.amount
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Transaction confirmation logged',
      requestId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Transaction log error', { 
      requestId,
      error: error.message
    });
    
    throw error;
  }
}));

export { router as agentRoutes };