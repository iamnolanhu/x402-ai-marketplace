# Contributing to x402 AI Marketplace

We welcome contributions to the x402 AI Marketplace! This document provides guidelines for contributing to the project.

## 🚀 Quick Start for Contributors

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/x402-ai-marketplace.git
   cd x402-ai-marketplace
   ```
3. **Install** dependencies:
   ```bash
   ./start.sh --check-only  # Check prerequisites
   npm install
   npm run install:all
   ```
4. **Set up** your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm 8+
- MetaMask with Base Sepolia testnet configured
- Test USDC from [Circle Faucet](https://faucet.circle.com/)
- Basic understanding of x402 payment protocol

### Running the Development Environment
```bash
# Start all services
npm run dev

# Or start individual services
npm run dev -w backend   # Backend API only
npm run dev -w frontend  # Frontend UI only
npm run dev -w sdk      # SDK development
```

### Testing Your Changes
```bash
# Run the test client
tsx test-client.ts

# Test with curl
curl http://localhost:3001/api/agents

# Run verification script
npm run verify
```

## 📋 Code Style and Standards

### TypeScript Guidelines
- Use TypeScript strict mode
- Provide proper type definitions for all functions
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Code Formatting
- Use 2 spaces for indentation
- Use semicolons consistently
- Follow existing patterns in the codebase
- Add JSDoc comments for public APIs

### Project Structure
```
x402-ai-marketplace/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/  # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── types/        # TypeScript definitions
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
├── sdk/               # TypeScript SDK
│   ├── src/
│   │   ├── client/       # Main client class
│   │   ├── types/        # Type definitions
│   │   └── utils/        # Utility functions
└── contracts/         # Smart contracts (if applicable)
```

## 🔧 Making Changes

### Types of Contributions

1. **Bug Fixes**: Fix issues in existing functionality
2. **Feature Additions**: Add new AI providers, payment methods, or UI features
3. **Documentation**: Improve README, guides, or code comments
4. **Testing**: Add or improve test coverage
5. **Performance**: Optimize existing code

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test improvements
- `perf/description` - Performance improvements

### Commit Message Format
```
type(scope): short description

Longer explanation of the change if needed.

- Bullet points for multiple changes
- Reference issues: Closes #123
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

## 🧪 Testing Guidelines

### Test Requirements
- Add tests for new features
- Ensure existing tests pass
- Test payment flows with testnet tokens
- Test API endpoints with curl or Postman
- Verify SDK functionality with test client

### Testing Checklist
- [ ] Backend API tests pass
- [ ] Frontend components render correctly
- [ ] SDK client methods work as expected
- [ ] x402 payment flow completes successfully
- [ ] Error handling works properly
- [ ] Environment variables are documented

## 🚀 Deployment Considerations

### Environment Variables
Document any new environment variables in:
- `.env.example`
- `README.md`
- This CONTRIBUTING.md file

### Breaking Changes
If your change breaks existing functionality:
1. Document the breaking change clearly
2. Provide migration instructions
3. Update version numbers appropriately
4. Consider backward compatibility options

## 📝 Pull Request Process

### Before Submitting
1. **Test thoroughly** - Run `npm run verify` to check everything works
2. **Update documentation** - Update README.md if needed
3. **Check formatting** - Ensure code follows project style
4. **Write good commit messages** - Follow the format above

### Pull Request Template
When creating a PR, please include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other: ___

## Testing
- [ ] Tested locally with `npm run dev`
- [ ] Ran test client successfully
- [ ] Tested payment flows
- [ ] Updated/added tests as needed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] No sensitive information committed
```

### Review Process
1. **Automated checks** must pass
2. **Manual review** by maintainers
3. **Testing verification** in review environment
4. **Approval** required before merge

## 🔐 Security Guidelines

### Sensitive Information
- **Never commit** private keys, secrets, or passwords
- Use environment variables for all sensitive data
- Add sensitive files to `.gitignore`
- Review commits for accidental secret exposure

### Smart Contract Security
- Test thoroughly on testnets before mainnet
- Follow smart contract security best practices
- Use well-tested libraries and patterns
- Consider audit requirements for significant changes

### API Security
- Validate all inputs
- Use proper error handling (don't expose internal errors)
- Implement rate limiting where appropriate
- Follow OWASP security guidelines

## 🌟 Areas We Need Help

We especially welcome contributions in these areas:

### High Priority
- **New AI Providers**: Integration with additional AI APIs
- **Payment Methods**: Support for more tokens/networks
- **UI/UX Improvements**: Better user interface and experience
- **Documentation**: More examples and guides
- **Testing**: Improved test coverage

### Medium Priority  
- **Performance**: Optimizations for faster response times
- **Mobile Support**: Responsive design improvements
- **Accessibility**: WCAG compliance improvements
- **Internationalization**: Multi-language support

### Advanced Features
- **Smart Contract Integration**: On-chain agent registry
- **Advanced Payment Models**: Subscriptions, bulk payments
- **Monitoring**: Better observability and logging
- **DevOps**: CI/CD improvements, Docker optimization

## 💬 Communication

### Getting Help
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Code Review**: Comments on pull requests

### Reporting Issues
When reporting issues, please include:
1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Node version, etc.)
5. **Logs or error messages** if applicable

### Feature Requests
When requesting features:
1. **Explain the use case** - why is this needed?
2. **Describe the solution** - what would you like to see?
3. **Consider alternatives** - are there other approaches?
4. **Offer to contribute** - can you help implement it?

## 🎯 Hackathon Context

This project was created for the CodeNYC/Coinbase hackathon. When contributing:

1. **Keep the hackathon spirit** - innovative, functional, demo-ready
2. **Follow CDP requirements** - must integrate Coinbase Developer Platform
3. **Think about judges** - clear value proposition and working demo
4. **Consider prizes** - align with special award categories where possible

## 📚 Resources

### Learning Materials
- [x402 Protocol Specification](https://github.com/x402-protocol/x402-protocol)
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/)
- [Base Network Documentation](https://docs.base.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

### Development Tools
- [MetaMask](https://metamask.io/) - Ethereum wallet
- [Circle Faucet](https://faucet.circle.com/) - Test USDC tokens
- [Base Sepolia Explorer](https://sepolia.basescan.org/) - Transaction explorer
- [Hyperbolic AI](https://hyperbolic.xyz/) - AI API provider

Thank you for contributing to x402 AI Marketplace! 🚀