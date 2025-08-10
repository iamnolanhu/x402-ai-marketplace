import { Request, Response, NextFunction } from 'express';
import { paymentMiddleware as x402PaymentMiddleware } from 'x402-express';
import { facilitator } from '@coinbase/x402';
import winston from 'winston';

// Payment configuration for different agent tiers
export const PAYMENT_CONFIG = {
  // Paid chat completions endpoint (POC)
  "POST /v1/chat/completions": {
    price: "$0.001",
    network: "base-sepolia",
  },
  // Basic AI models - low cost
  "POST /api/agents/basic/invoke": {
    price: "$0.05",
    network: "base",
  },
  // Advanced AI models - medium cost
  "POST /api/agents/advanced/invoke": {
    price: "$0.10", 
    network: "base",
  },
  // Premium AI models - high cost
  "POST /api/agents/premium/invoke": {
    price: "$0.25",
    network: "base",
  },
  // Custom agent deployment
  "POST /api/agents/deploy": {
    price: "$1.00",
    network: "base",
  },
  // Dynamic pricing for agent invocations
  "POST /api/agents/:id/invoke": {
    price: "$0.10", // Default price, can be overridden per agent
    network: "base",
  }
} as const;

export interface PaymentRequest extends Request {
  paymentVerified?: boolean;
  paymentDetails?: {
    amount: string;
    currency: string;
    network: string;
    transactionHash?: string;
    fromAddress?: string;
  };
}

/**
 * Create payment middleware with proper configuration
 */
export function createPaymentMiddleware(logger?: winston.Logger) {
  const payTo = process.env.PAYMENT_ADDRESS;
  
  if (!payTo) {
    throw new Error('PAYMENT_ADDRESS environment variable not configured');
  }

  return x402PaymentMiddleware(
    payTo,
    PAYMENT_CONFIG,
    facilitator
  );
}

/**
 * Conditional payment middleware that applies payment requirements based on route
 */
export function conditionalPaymentMiddleware(logger?: winston.Logger) {
  return async (req: PaymentRequest, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] as string;
    
    try {
      // Check if this route requires payment
      const routeKey = `${req.method} ${req.route?.path || req.path}`;
      const requiresPayment = Object.keys(PAYMENT_CONFIG).some(pattern => {
        // Simple pattern matching - in production, use more sophisticated routing
        const regex = pattern.replace(':id', '[^/]+').replace('*', '.*');
        return new RegExp(`^${regex}$`).test(routeKey);
      });

      if (requiresPayment) {
        // Apply x402 payment middleware
        const paymentMiddleware = createPaymentMiddleware(logger);
        
        return new Promise<void>((resolve, reject) => {
          paymentMiddleware(req, res, (err) => {
            if (err) {
              logger?.error('Payment middleware error', { 
                requestId, 
                error: err.message,
                route: routeKey
              });
              reject(err);
            } else {
              req.paymentVerified = true;
              resolve();
            }
          });
        }).then(() => next()).catch(next);
      } else {
        // No payment required, continue
        next();
      }
    } catch (error) {
      logger?.error('Conditional payment middleware error', {
        requestId,
        error: error.message,
        route: req.path
      });
      next(error);
    }
  };
}

/**
 * Middleware to extract payment information from x402 headers
 */
export function extractPaymentInfo() {
  return (req: PaymentRequest, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers['x-payment'] as string;
    const transactionHash = req.headers['x-transaction-hash'] as string;
    const paymentNetwork = req.headers['x-payment-network'] as string;
    const payerAddress = req.headers['x-payer-address'] as string;

    if (paymentHeader) {
      try {
        // Parse payment information
        // This is a simplified implementation - in production, properly parse x402 payment format
        req.paymentDetails = {
          amount: "0.10", // Extract from payment header
          currency: "USDC",
          network: paymentNetwork || "base",
          transactionHash,
          fromAddress: payerAddress
        };
      } catch (error) {
        // Invalid payment format, but don't fail here
        // Let the payment middleware handle validation
      }
    }

    next();
  };
}

/**
 * Dynamic pricing middleware for agent-specific pricing
 */
export function dynamicPricingMiddleware(agents: Map<string, any>) {
  return (req: PaymentRequest, res: Response, next: NextFunction) => {
    const agentId = req.params.id;
    
    if (agentId && agents.has(agentId)) {
      const agent = agents.get(agentId);
      
      // Override default pricing based on agent configuration
      if (agent.pricing) {
        // This would require modifying the x402 middleware to accept dynamic pricing
        // For now, we use the default configuration
        req.body._agentPricing = {
          price: agent.pricing.price || "$0.10",
          network: agent.pricing.network || "base"
        };
      }
    }
    
    next();
  };
}

export { paymentMiddleware } from 'x402-express';