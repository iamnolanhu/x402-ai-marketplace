#!/bin/bash

# x402 AI Marketplace - Startup Script
# Quick and easy way to get the POC running for hackathon demos

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  x402 AI Marketplace - Quick Start${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node() {
    print_status "Checking Node.js installation..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed!"
        print_error "Please install Node.js >= 18.0.0 from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js version $NODE_VERSION found, but >= 18.0.0 is required"
        print_error "Please upgrade Node.js from https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js $NODE_VERSION found"
}

# Check npm version
check_npm() {
    print_status "Checking npm installation..."
    
    if ! command_exists npm; then
        print_error "npm is not installed!"
        print_error "Please install npm >= 8.0.0"
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)
    
    if [ "$NPM_MAJOR" -lt 8 ]; then
        print_error "npm version $NPM_VERSION found, but >= 8.0.0 is required"
        print_error "Please upgrade npm: npm install -g npm@latest"
        exit 1
    fi
    
    print_success "npm $NPM_VERSION found"
}

# Check environment file
check_env() {
    print_status "Checking environment configuration..."
    
    if [ ! -f .env ]; then
        print_warning ".env file not found"
        print_status "Creating .env from template..."
        cp .env.example .env
        print_warning "⚠️  IMPORTANT: Please edit .env with your actual values!"
        print_warning "   - Add your wallet private key"
        print_warning "   - Add your CDP API credentials"
        print_warning "   - Add your Hyperbolic API key"
        print_warning "   - Configure payment address"
        echo ""
        read -p "Press Enter to continue with demo values, or Ctrl+C to exit and configure .env first..."
    else
        print_success ".env file found"
    fi
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    
    # Check if node_modules exists and is populated
    if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
        print_status "Installing root dependencies..."
        npm install
    else
        print_success "Root dependencies already installed"
    fi
    
    # Install workspace dependencies
    print_status "Installing workspace dependencies..."
    npm run install:all
    
    print_success "All dependencies installed"
}

# Build projects
build_projects() {
    print_status "Building projects..."
    
    # Build SDK first (needed by other projects)
    print_status "Building SDK..."
    npm run sdk:build
    
    # Build all projects
    print_status "Building all workspaces..."
    npm run build
    
    print_success "All projects built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    echo ""
    print_status "🚀 Starting backend and frontend servers..."
    print_status "   Backend:  http://localhost:3001"
    print_status "   Frontend: http://localhost:3000"
    echo ""
    print_status "Press Ctrl+C to stop all services"
    echo ""
    
    # Start both services concurrently
    npm run dev
}

# Health check
health_check() {
    print_status "Running health checks..."
    
    # Wait a moment for servers to start
    sleep 3
    
    # Check backend health
    if command_exists curl; then
        if curl -s http://localhost:3001/health >/dev/null; then
            print_success "Backend server is healthy"
        else
            print_warning "Backend server health check failed"
        fi
        
        if curl -s http://localhost:3000 >/dev/null; then
            print_success "Frontend server is accessible"
        else
            print_warning "Frontend server health check failed"
        fi
    else
        print_warning "curl not available, skipping health checks"
    fi
}

# Show demo instructions
show_demo_instructions() {
    echo ""
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}  Quick Demo Instructions${NC}"
    echo -e "${PURPLE}========================================${NC}"
    echo ""
    echo "1. Open your browser to: http://localhost:3000"
    echo "2. Connect your wallet (MetaMask recommended)"
    echo "3. Browse available AI models"
    echo "4. Make a test purchase with USDC"
    echo "5. Access your purchased model"
    echo ""
    echo -e "${BLUE}📖 For detailed demo guide, see: DEMO_GUIDE.md${NC}"
    echo ""
    echo -e "${YELLOW}💡 Test with Base Sepolia testnet for safe testing${NC}"
    echo -e "${YELLOW}💡 Get testnet USDC from: https://faucet.circle.com/${NC}"
    echo ""
}

# Cleanup function for graceful shutdown
cleanup() {
    echo ""
    print_status "Shutting down services..."
    # Kill any background processes
    jobs -p | xargs -r kill
    print_success "Shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    print_header
    
    # Pre-flight checks
    check_node
    check_npm
    check_env
    
    # Setup
    install_deps
    build_projects
    
    # Show instructions before starting
    show_demo_instructions
    
    # Start services
    start_services
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "x402 AI Marketplace Startup Script"
        echo ""
        echo "Usage: ./start.sh [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --check-only   Run checks without starting services"
        echo "  --build-only   Build projects without starting services"
        echo ""
        echo "Environment:"
        echo "  Copy .env.example to .env and configure your values"
        echo ""
        exit 0
        ;;
    --check-only)
        print_header
        check_node
        check_npm
        check_env
        print_success "All checks passed!"
        exit 0
        ;;
    --build-only)
        print_header
        check_node
        check_npm
        install_deps
        build_projects
        print_success "Build complete!"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        print_error "Use --help for usage information"
        exit 1
        ;;
esac