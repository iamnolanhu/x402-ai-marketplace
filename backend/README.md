# x402 AI Marketplace Backend

Express.js backend API server for the x402 AI Marketplace, featuring:

- **x402 Payment Protocol Integration** - Pay-per-use AI agent invocations
- **Hyperbolic AI Integration** - Multiple AI models via Hyperbolic API
- **CDP Wallet Integration** - USDC payments on Base network
- **Agent Marketplace** - Deploy and invoke AI agents

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Test the API**
   ```bash
   curl http://localhost:3001/health
   ```

## Required Environment Variables

```env
# CDP API Credentials
CDP_API_KEY_ID=your_cdp_api_key_id
CDP_API_KEY_SECRET=your_cdp_api_key_secret

# Wallet Configuration
PAYMENT_ADDRESS=your_wallet_address

# AI Integration
HYPERBOLIC_API_KEY=your_hyperbolic_api_key
```

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /ready` - Readiness check with service validation
- `GET /api/agents` - List all available AI agents
- `GET /api/agents/:id` - Get specific agent details
- `GET /api/agents/models` - List available AI models
- `GET /api/agents/wallet/info` - Get wallet information

### Payment-Required Endpoints (x402)

These endpoints require USDC payment via x402 protocol:

- `POST /api/agents/:id/invoke` - Invoke an AI agent ($0.10 USDC)
- `POST /api/agents/deploy` - Deploy a new agent ($1.00 USDC)

### Development Endpoints

- `POST /api/agents/wallet/fund` - Fund wallet via faucet (testnet only)
- `POST /api/agents/transaction-log` - Log transaction confirmations

## x402 Payment Flow

1. **Client Request**: Make request to paid endpoint without payment
   ```bash
   curl -X POST http://localhost:3001/api/agents/agent_123/invoke \
     -H "Content-Type: application/json" \
     -d '{"input": "Hello, world!"}'
   ```

2. **402 Payment Required**: Server responds with payment requirements
   ```json
   {
     "error": "Payment Required",
     "payment": {
       "amount": "0.10",
       "currency": "USDC",
       "network": "base",
       "address": "0x..."
     }
   }
   ```

3. **Make Payment**: Client creates USDC payment on Base network

4. **Retry with Payment**: Include payment proof in headers
   ```bash
   curl -X POST http://localhost:3001/api/agents/agent_123/invoke \
     -H "Content-Type: application/json" \
     -H "X-PAYMENT: <payment_proof>" \
     -d '{"input": "Hello, world!"}'
   ```

5. **Success Response**: Server verifies payment and returns result

## Agent Invocation Example

```javascript
// Using x402-fetch client
import { x402Fetch } from 'x402-fetch';

const response = await x402Fetch('http://localhost:3001/api/agents/agent_123/invoke', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    input: 'Write a hello world function in Python',
    parameters: {
      temperature: 0.7,
      max_tokens: 500
    }
  })
});

const result = await response.json();
console.log(result.response);
```

## Agent Deployment Example

```javascript
const deployResponse = await x402Fetch('http://localhost:3001/api/agents/deploy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Custom Agent',
    description: 'A specialized coding assistant',
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
    systemPrompt: 'You are an expert Python developer...',
    pricing: {
      price: '$0.15',
      network: 'base'
    },
    capabilities: ['python', 'debugging', 'optimization'],
    tags: ['coding', 'python', 'development']
  })
});
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run clean` - Clean build directory

### Project Structure

```
src/
├── index.ts              # Main application entry point
├── middleware/           # Express middleware
│   ├── payment.ts       # x402 payment middleware
│   ├── logger.ts        # Request logging
│   └── errorHandler.ts  # Global error handling
├── routes/              # API route handlers
│   └── agents.ts        # Agent marketplace routes
├── services/            # Business logic services
│   ├── aiService.ts     # AI model integration
│   └── walletService.ts # CDP wallet integration
└── utils/               # Utility functions
    └── startup.ts       # Application startup helpers
```

## Testing

### Manual Testing

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Check health**
   ```bash
   curl http://localhost:3001/health
   ```

3. **List agents**
   ```bash
   curl http://localhost:3001/api/agents
   ```

4. **Try a paid request (will return 402)**
   ```bash
   curl -X POST http://localhost:3001/api/agents/agent_123/invoke \
     -H "Content-Type: application/json" \
     -d '{"input": "Hello!"}'
   ```

### Integration Testing

The server integrates with:
- **Hyperbolic AI API** for model inference
- **Coinbase CDP SDK** for wallet operations
- **x402 Protocol** for payment processing

## Deployment

### Environment Setup

For production deployment, ensure all required environment variables are configured:

```bash
# Production environment variables
NODE_ENV=production
PORT=3001
CDP_API_KEY_ID=prod_key_id
CDP_API_KEY_SECRET=prod_key_secret
PAYMENT_ADDRESS=0x_production_wallet_address
HYPERBOLIC_API_KEY=prod_hyperbolic_key
NETWORK_ID=base  # Use mainnet for production
```

### Build and Start

```bash
npm run build
npm start
```

## Architecture

The backend follows a layered architecture:

1. **API Layer** (`routes/`) - HTTP request handling and validation
2. **Business Logic** (`services/`) - Core application logic
3. **Integration Layer** (`services/`) - External API integrations
4. **Middleware Layer** (`middleware/`) - Cross-cutting concerns

Key integrations:
- **x402 Express Middleware** for payment processing
- **Hyperbolic API** for AI model inference  
- **Coinbase CDP SDK** for blockchain wallet operations
- **Winston** for structured logging

## Security Considerations

- All API keys stored as environment variables
- Payment verification through x402 protocol
- Request validation using Zod schemas
- CORS configured for known frontend origins
- Helmet.js for security headers
- Structured logging for audit trails

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Copy `.env.example` to `.env` and configure all required variables

2. **Hyperbolic API Errors**
   - Verify your Hyperbolic API key is valid
   - Check model names against available models

3. **CDP Wallet Issues**
   - Ensure CDP API credentials are correct
   - For testnet, use `base-sepolia` network ID

4. **x402 Payment Failures**
   - Verify payment address is configured
   - Ensure wallet has USDC balance for testing

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm run dev
```

### Health Checks

The `/ready` endpoint performs comprehensive health checks:
- Environment variable validation
- Hyperbolic API connectivity
- CDP service configuration

Use this for monitoring and deployment verification.