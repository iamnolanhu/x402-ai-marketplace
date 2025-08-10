# x402 AI Marketplace - Demo Guide

**🎯 Quick Demo for Hackathon Judges**

This guide provides step-by-step instructions to demonstrate the x402 AI Marketplace POC during the CodeNYC Hackathon evaluation.

## 📋 Prerequisites

### System Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0  
- **Browser**: Chrome/Firefox with MetaMask extension
- **Network**: Base Sepolia testnet

### Required Accounts & Keys
- **MetaMask Wallet**: With Base Sepolia testnet configured
- **Test USDC**: Get from [Circle Faucet](https://faucet.circle.com/)
- **CDP API Keys**: From [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
- **Hyperbolic API Key**: From [Hyperbolic Dashboard](https://app.hyperbolic.xyz/)

## 🚀 Quick Start (2 minutes)

### Option 1: One-Command Start
```bash
# Clone and enter the project directory
cd x402-ai-marketplace

# Run the magic startup script
./start.sh
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install
npm run install:all

# 2. Configure environment
cp .env.example .env
# Edit .env with your actual keys

# 3. Build and start
npm run build
npm run dev
```

### Option 3: Docker (Production-like)
```bash
# Development with hot reload
npm run docker:dev

# Production deployment
npm run docker:prod
```

## 🎭 Demo Script (5-7 minutes)

### Phase 1: System Overview (1 minute)
1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Show Architecture**: 
   - Frontend: Next.js with Coinbase Wallet integration
   - Backend: Express API with x402 payment protocol
   - Blockchain: Base Sepolia testnet for payments

### Phase 2: Wallet Connection (1 minute)
1. **Connect Wallet**: Click "Connect Wallet" button
2. **MetaMask Integration**: Show seamless Coinbase Wallet SDK integration
3. **Network Check**: Verify Base Sepolia testnet connection
4. **Balance Display**: Show USDC balance in interface

### Phase 3: Browse AI Models (1 minute)
1. **Model Catalog**: Browse available AI models
   - Llama 2 7B Chat
   - Stable Diffusion XL
   - CodeLlama Instruct
2. **Pricing Display**: Show transparent USDC pricing
3. **Model Details**: Click for specifications and capabilities

### Phase 4: x402 Payment Flow (2 minutes)
1. **Select Model**: Choose a model to purchase access
2. **Payment Initiation**: Click "Purchase Access"
3. **x402 Protocol**: 
   - Show HTTP 402 "Payment Required" response
   - Demonstrate payment header generation
   - Show on-chain USDC transaction
4. **Payment Verification**: Real-time transaction confirmation
5. **Access Granted**: Automatic access after payment confirmation

### Phase 5: AI Model Usage (1-2 minutes)
1. **Interface Access**: Show unlocked model interface
2. **API Integration**: Demonstrate direct API calls to Hyperbolic
3. **Real Interaction**: 
   - Text generation with Llama 2
   - OR Image generation with Stable Diffusion
4. **Payment History**: Show transaction records

### Phase 6: Technical Deep Dive (1 minute)
1. **Developer Console**: Show x402 headers and protocol flow
2. **Blockchain Explorer**: View USDC transactions on Base
3. **Backend Logs**: Real-time payment processing logs
4. **Smart Integration**: CDP SDK + x402 protocol working together

## 🔧 Key Features to Highlight

### 1. x402 Payment Protocol Integration
- **HTTP 402 Status**: Proper "Payment Required" responses
- **Payment Headers**: Structured payment request/response flow
- **On-chain Settlement**: USDC payments on Base network
- **Facilitator Pattern**: Efficient payment verification

### 2. Coinbase Developer Platform Integration
- **Wallet SDK**: Seamless wallet connection experience  
- **CDP Wallets**: Programmatic wallet operations
- **Base Network**: Native Base Sepolia integration
- **USDC Payments**: Stable, fast, low-cost transactions

### 3. AI Marketplace Features  
- **Multiple Models**: Diverse AI capabilities (text, image, code)
- **Per-Use Payments**: Micro-transactions for individual requests
- **Real-time Access**: Instant model access after payment
- **Transparent Pricing**: Clear USDC costs for each model

### 4. Production-Ready Architecture
- **Docker Deployment**: Container-based production setup
- **Nginx Proxy**: Load balancing and SSL termination
- **Health Checks**: Monitoring and reliability features
- **Security**: Rate limiting, input validation, secure headers

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Failed
```bash
# Check browser console for errors
# Ensure MetaMask is installed and Base Sepolia is configured
```

#### Payment Not Processing
```bash
# Verify USDC balance in wallet
# Check Base Sepolia network status
# Review backend logs: npm run logs
```

#### Environment Configuration
```bash
# Verify .env file is configured
npm run check

# Reset environment from template
npm run setup:env
```

#### Services Not Starting
```bash
# Check system requirements
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0

# Clean install
npm run clean
npm install
```

### Health Checks
```bash
# Verify all services are running
npm run health

# Check individual components
curl http://localhost:3001/health  # Backend
curl http://localhost:3000         # Frontend
```

## 📊 Demo Metrics

### Performance Targets
- **Wallet Connection**: < 5 seconds
- **Payment Processing**: < 30 seconds  
- **Model Access**: < 10 seconds after payment
- **API Response**: < 5 seconds per AI request

### Success Criteria
- ✅ Wallet connects successfully
- ✅ USDC balance displays correctly
- ✅ Payment flow completes end-to-end
- ✅ AI model responds with valid output
- ✅ Transaction appears on Base explorer

## 🎯 Judging Criteria Focus

### Impact/Usefulness (25%)
- **Real Problem**: AI model access friction
- **Practical Solution**: Micro-payments for AI services
- **Market Opportunity**: B2B2C AI marketplace potential

### Completeness/Functionality (25%)
- **End-to-End Flow**: Complete purchase and usage cycle
- **Error Handling**: Graceful failure modes
- **User Experience**: Intuitive interface design

### Scalability/Future Potential (20%)
- **Multi-Model Support**: Extensible architecture
- **Payment Flexibility**: Multiple pricing models
- **Enterprise Ready**: Production deployment capabilities

### User Experience (20%)
- **Wallet Integration**: Seamless Web3 onboarding
- **Payment UX**: Clear, fast, reliable transactions
- **Interface Design**: Clean, professional UI

### Innovation/Creativity (10%)
- **x402 Protocol**: Novel payment protocol implementation
- **CDP Integration**: Creative use of Coinbase platform
- **AI + Payments**: Innovative combination of technologies

## 🚦 Demo Checklist

### Before Demo
- [ ] Services running and healthy
- [ ] Wallet connected with test USDC
- [ ] Environment variables configured
- [ ] Browser dev tools open (optional)
- [ ] Base Sepolia explorer tab ready

### During Demo
- [ ] Explain the problem and solution
- [ ] Show wallet connection flow  
- [ ] Demonstrate payment protocol
- [ ] Execute AI model interaction
- [ ] Highlight technical innovations
- [ ] Address any judge questions

### After Demo
- [ ] Provide GitHub repository access
- [ ] Share documentation links
- [ ] Offer technical deep-dive if requested
- [ ] Submit all required hackathon materials

## 🔗 Quick Links

- **Live Demo**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Base Explorer**: https://sepolia.basescan.org/
- **Circle Faucet**: https://faucet.circle.com/
- **GitHub Repo**: [Repository URL]

## 💡 Advanced Demo Options

### Technical Deep Dive
- Show Docker deployment: `npm run docker:prod`
- Demonstrate load balancing with Nginx
- Review x402 protocol implementation in code
- Explain CDP SDK integration patterns

### Scalability Demo
- Show multiple concurrent payments
- Demonstrate different AI model types
- Explain enterprise deployment architecture
- Discuss future roadmap and features

### Security Features
- Rate limiting in action
- Input validation and sanitization
- Secure payment verification process
- Environment-based configuration management

---

**🏆 Ready to impress the judges with a working, innovative AI marketplace powered by x402 payments and Coinbase's developer platform!**