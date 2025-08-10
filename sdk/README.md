# x402 AI Marketplace SDK

TypeScript SDK for integrating with the x402 AI marketplace. Provides automatic payment handling via the x402 protocol.

## Installation

```bash
npm install x402-ai-marketplace-sdk
# or from local development
npm install ../sdk
```

## Quick Start

```typescript
import { X402AIMarketplaceClient, privateKeyToAccount } from 'x402-ai-marketplace-sdk';

// Create client
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const client = new X402AIMarketplaceClient({
  baseUrl: 'http://localhost:3001',
  account,
  network: 'base-sepolia'
});

// List available agents
const agents = await client.listAgents();

// Invoke agent (automatic payment handling)
const response = await client.invokeAgent('agent-id', {
  input: "Hello, world!",
  parameters: { max_tokens: 100 }
});
```

## API Reference

### X402AIMarketplaceClient

#### Constructor Options

```typescript
interface SDKConfig {
  baseUrl: string;      // Marketplace API base URL
  account: Account;     // Viem account for payments
  network?: string;     // Network ID (default: 'base-sepolia')
  timeout?: number;     // Request timeout in ms (default: 30000)
}
```

#### Methods

**`listAgents(): Promise<ListAgentsResponse>`**
- Get all available agents in the marketplace

**`getAgent(id: string): Promise<GetAgentResponse>`** 
- Get detailed information about a specific agent

**`invokeAgent(id: string, payload: AgentInvokeRequest): Promise<AgentInvokeResponse>`**
- Invoke an agent with automatic x402 payment handling
- Returns response with optional payment transaction details

**`deployAgent(config: AgentDeployRequest): Promise<AgentDeployResponse>`**
- Deploy a new agent to the marketplace (requires payment)

**`getAvailableModels(): Promise<ModelsResponse>`**
- Get list of available AI models

**`getWalletInfo(): Promise<WalletResponse>`**
- Get marketplace wallet information

**`fundWallet(): Promise<FundResponse>`**
- Fund wallet via faucet (testnet only)

### x402 Payment Helpers

**`wrapFetchWithPayment(fetch, options): typeof fetch`**
- Wrap any fetch function with automatic x402 payment handling

**`decodeXPaymentResponse(header: string): PaymentResponse`**
- Decode payment response headers from x402 protocol

**`createX402Fetch(privateKey: Hex, network?: string): typeof fetch`**
- Create a payment-enabled fetch function

## Examples

See the `examples/` directory for usage examples:

```bash
npm run example:basic
```

## Payment Flow

The SDK automatically handles the x402 payment flow:

1. **Initial Request**: SDK makes request to agent endpoint
2. **Payment Required**: Server responds with 402 and payment details  
3. **Payment Processing**: SDK processes payment with your wallet
4. **Retry Request**: SDK retries with payment proof
5. **Success Response**: Server returns result with payment confirmation

## Error Handling

The SDK provides detailed error messages for common issues:

- Network connectivity problems
- Payment failures
- Invalid agent IDs  
- Insufficient wallet balance
- API rate limiting

## Development

```bash
# Build SDK
npm run build

# Watch mode
npm run dev  

# Run tests
npm run test

# Run example
npm run example:basic
```

## Types

All TypeScript types are exported from the main package:

```typescript
import type { 
  Agent,
  AgentInvokeRequest,
  AgentInvokeResponse,
  AgentDeployRequest,
  PaymentResponse,
  SDKConfig
} from 'x402-ai-marketplace-sdk';
```