#!/bin/bash

# x402 AI Marketplace - Verification Script
# Quick health check for hackathon demos

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_check() {
    echo -e "${GREEN}✓${NC} $1"
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}!${NC} $1"
}

echo "🔍 x402 AI Marketplace - System Verification"
echo "============================================"

# Check if services are running
echo ""
echo "📡 Service Status:"

if lsof -ti:3000 >/dev/null 2>&1; then
    print_check "Frontend (port 3000): Running"
    FRONTEND_UP=true
else
    print_fail "Frontend (port 3000): Not running"
    FRONTEND_UP=false
fi

if lsof -ti:3001 >/dev/null 2>&1; then
    print_check "Backend (port 3001): Running"
    BACKEND_UP=true
else
    print_fail "Backend (port 3001): Not running"
    BACKEND_UP=false
fi

# Health checks
echo ""
echo "🩺 Health Checks:"

if [ "$BACKEND_UP" = true ]; then
    if curl -sf http://localhost:3001/health >/dev/null; then
        print_check "Backend health endpoint: OK"
        BACKEND_HEALTHY=true
    else
        print_fail "Backend health endpoint: Failed"
        BACKEND_HEALTHY=false
    fi
else
    print_warn "Backend health: Skipped (service not running)"
    BACKEND_HEALTHY=false
fi

if [ "$FRONTEND_UP" = true ]; then
    if curl -sf http://localhost:3000 >/dev/null 2>&1; then
        print_check "Frontend accessibility: OK"
        FRONTEND_HEALTHY=true
    else
        print_fail "Frontend accessibility: Failed"
        FRONTEND_HEALTHY=false
    fi
else
    print_warn "Frontend accessibility: Skipped (service not running)"
    FRONTEND_HEALTHY=false
fi

# Environment checks
echo ""
echo "⚙️ Environment Configuration:"

if [ -f ".env" ]; then
    print_check ".env file: Present"
    
    # Check critical variables
    if grep -q "PRIVATE_KEY=0x" .env && [ "$(grep "PRIVATE_KEY=" .env | cut -d'=' -f2 | wc -c)" -gt 10 ]; then
        print_check "Private key: Configured"
    else
        print_warn "Private key: Not properly configured"
    fi
    
    if grep -q "CDP_API_KEY_ID=" .env && ! grep -q "your_cdp_api_key_id" .env; then
        print_check "CDP API credentials: Configured"
    else
        print_warn "CDP API credentials: Using example values"
    fi
    
    if grep -q "HYPERBOLIC_API_KEY=" .env && ! grep -q "your_hyperbolic_api_key" .env; then
        print_check "Hyperbolic API key: Configured"
    else
        print_warn "Hyperbolic API key: Using example values"
    fi
else
    print_fail ".env file: Missing"
fi

# Dependency checks
echo ""
echo "📦 Dependencies:"

if [ -d "node_modules" ] && [ -n "$(ls -A node_modules 2>/dev/null)" ]; then
    print_check "Root dependencies: Installed"
else
    print_fail "Root dependencies: Missing"
fi

if [ -d "backend/node_modules" ] && [ -n "$(ls -A backend/node_modules 2>/dev/null)" ]; then
    print_check "Backend dependencies: Installed"
else
    print_fail "Backend dependencies: Missing"
fi

if [ -d "frontend/node_modules" ] && [ -n "$(ls -A frontend/node_modules 2>/dev/null)" ]; then
    print_check "Frontend dependencies: Installed"
else
    print_fail "Frontend dependencies: Missing"
fi

# Build checks
echo ""
echo "🏗️ Build Status:"

if [ -d "backend/dist" ] && [ -n "$(ls -A backend/dist 2>/dev/null)" ]; then
    print_check "Backend build: Present"
else
    print_warn "Backend build: Missing (may use tsx watch)"
fi

if [ -d "frontend/.next" ] && [ -n "$(ls -A frontend/.next 2>/dev/null)" ]; then
    print_check "Frontend build: Present"
else
    print_warn "Frontend build: Missing (may use dev mode)"
fi

# API endpoint tests
echo ""
echo "🚀 API Endpoints:"

if [ "$BACKEND_HEALTHY" = true ]; then
    # Test agents endpoint
    if curl -sf http://localhost:3001/agents >/dev/null; then
        print_check "Agents endpoint: Accessible"
    else
        print_fail "Agents endpoint: Failed"
    fi
    
    # Test CORS
    if curl -sf -H "Origin: http://localhost:3000" http://localhost:3001/health >/dev/null; then
        print_check "CORS configuration: Working"
    else
        print_warn "CORS configuration: May have issues"
    fi
else
    print_warn "API endpoints: Skipped (backend not healthy)"
fi

# Summary
echo ""
echo "📊 Summary:"

ISSUES=0
WARNINGS=0

if [ "$FRONTEND_UP" != true ] || [ "$FRONTEND_HEALTHY" != true ]; then
    ISSUES=$((ISSUES + 1))
fi

if [ "$BACKEND_UP" != true ] || [ "$BACKEND_HEALTHY" != true ]; then
    ISSUES=$((ISSUES + 1))
fi

if [ ! -f ".env" ]; then
    ISSUES=$((ISSUES + 1))
fi

if ! grep -q "PRIVATE_KEY=0x" .env 2>/dev/null; then
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
if [ $ISSUES -eq 0 ]; then
    print_check "System Status: Ready for demo! 🎉"
    echo ""
    echo "🌐 Demo URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:3001"
    echo "  Health:   http://localhost:3001/health"
    echo ""
    echo "📖 Next Steps:"
    echo "  1. Open http://localhost:3000 in your browser"
    echo "  2. Connect your MetaMask wallet"
    echo "  3. Ensure you have Base Sepolia testnet configured"
    echo "  4. Get test USDC from https://faucet.circle.com/"
    echo "  5. Start the demo!"
else
    print_fail "System Status: $ISSUES critical issues found"
    echo ""
    echo "🔧 Suggested fixes:"
    if [ "$FRONTEND_UP" != true ]; then
        echo "  - Start frontend: npm run dev (in separate terminal)"
    fi
    if [ "$BACKEND_UP" != true ]; then
        echo "  - Start backend: cd backend && npm run dev"
    fi
    if [ ! -f ".env" ]; then
        echo "  - Setup environment: cp .env.example .env"
    fi
    echo "  - Or run: ./start.sh (automatic setup)"
fi

if [ $WARNINGS -gt 0 ]; then
    echo ""
    print_warn "$WARNINGS configuration warnings (demo may work with reduced functionality)"
fi

echo ""
echo "🆘 Need help? Check DEMO_GUIDE.md for detailed instructions"

exit $ISSUES