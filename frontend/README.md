# x402 AI Marketplace Frontend

A Next.js frontend for the AI marketplace featuring wallet connection, agent browsing, and x402 payment flow integration.

## Features

- 🏠 **Landing Page**: Showcases AI agents and marketplace features
- 🛒 **Agent Marketplace**: Browse and search AI agents with filtering
- 💳 **Wallet Integration**: Connect Coinbase Wallet for payments
- 🤖 **Agent Invocation**: Request AI services with x402 payment flow
- 📱 **Responsive Design**: Clean, mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **Wallet**: Coinbase Wallet SDK + ethers.js
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Pages

- `/` - Landing page with featured agents
- `/marketplace` - Browse all available agents
- `/agent/[id]` - Agent details and invocation interface
- `/how-it-works` - Guide to using the platform

## Key Components

- `WalletProvider` - Manages wallet connection and Web3 state
- `WalletConnect` - Wallet connection UI with dropdown
- `AgentCard` - Agent preview cards for marketplace
- `AgentInvokeForm` - Form for requesting agent services
- `PaymentModal` - Handles x402 payment flow

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

Create `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# x402 Protocol Configuration
NEXT_PUBLIC_X402_PAYMENT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NETWORK_ID=base-sepolia

# USDC Contract Address on Base Sepolia
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Base Sepolia RPC
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
```

## x402 Integration

The frontend demonstrates the x402 payment protocol:

1. **Request Phase**: User submits request to agent
2. **Payment Required**: Server responds with 402 status and payment details
3. **Payment Flow**: User authorizes USDC payment via wallet
4. **Service Delivery**: Agent processes request and returns results

## Wallet Integration

Uses Coinbase Wallet SDK for:
- Connecting to Base Sepolia network
- Signing transactions for USDC payments
- Managing wallet state across the application

## Future Enhancements

- Real-time payment status updates
- Agent usage history and analytics
- USDC token approvals and management
- Advanced agent filtering and sorting
- User reviews and ratings system

## Testing

The app is configured for Base Sepolia testnet. To test:

1. Connect a wallet with Sepolia ETH for gas
2. Get USDC on Base Sepolia from faucets
3. Browse agents and test the payment flow

Built for the CodeNYC Hackathon 2025 - x402 AI Marketplace POC