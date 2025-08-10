#!/bin/bash

# x402 AI Marketplace - Production Deployment Script
# Supports multiple cloud platforms for hackathon demos

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi
    
    # Deploy frontend
    print_status "Deploying frontend to Vercel..."
    cd frontend
    vercel --prod
    cd ..
    
    print_status "✅ Frontend deployed to Vercel"
    
    # Backend needs separate deployment
    print_warning "Backend needs separate deployment (Railway, Render, etc.)"
    print_warning "Or use: vercel --prod --cwd backend (if configured)"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command_exists railway; then
        print_error "Railway CLI not found. Install with: npm i -g @railway/cli"
        exit 1
    fi
    
    # Deploy backend
    print_status "Deploying backend to Railway..."
    cd backend
    railway login
    railway up
    cd ..
    
    print_status "✅ Backend deployed to Railway"
    print_warning "Frontend should be deployed separately to Vercel/Netlify"
}

# Deploy with Docker to any container platform
deploy_docker() {
    local platform=${1:-"generic"}
    print_status "Building Docker images for $platform..."
    
    # Build images
    docker-compose build
    
    # Tag images for registry
    docker tag x402-ai-marketplace_backend:latest x402-backend:latest
    docker tag x402-ai-marketplace_frontend:latest x402-frontend:latest
    
    print_status "✅ Docker images built and tagged"
    print_warning "Push to your container registry:"
    echo "  docker push your-registry/x402-backend:latest"
    echo "  docker push your-registry/x402-frontend:latest"
}

# Deploy to Render
deploy_render() {
    print_status "Setting up Render deployment..."
    
    print_warning "Manual steps for Render deployment:"
    echo "1. Connect your GitHub repository to Render"
    echo "2. Create Web Service for frontend:"
    echo "   - Build Command: cd frontend && npm install && npm run build"
    echo "   - Start Command: cd frontend && npm start"
    echo "3. Create Web Service for backend:"
    echo "   - Build Command: cd backend && npm install && npm run build"
    echo "   - Start Command: cd backend && npm start"
    echo "4. Add environment variables from .env.example"
}

# Deploy to Fly.io
deploy_fly() {
    print_status "Deploying to Fly.io..."
    
    if ! command_exists flyctl; then
        print_error "Fly CLI not found. Install from: https://fly.io/docs/hands-on/install-flyctl/"
        exit 1
    fi
    
    # Initialize Fly app if needed
    if [ ! -f "fly.toml" ]; then
        print_status "Initializing Fly.io configuration..."
        flyctl launch --no-deploy
    fi
    
    # Deploy
    flyctl deploy
    print_status "✅ Deployed to Fly.io"
}

# Setup environment for production
setup_production_env() {
    print_status "Setting up production environment..."
    
    if [ ! -f ".env.production" ]; then
        cp .env.example .env.production
        print_warning "Created .env.production - please update with production values"
    fi
    
    # Validate critical environment variables
    if ! grep -q "PRIVATE_KEY=0x[a-fA-F0-9]" .env.production; then
        print_error "Production private key not set in .env.production"
        exit 1
    fi
    
    print_status "✅ Production environment ready"
}

# Main menu
show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  x402 AI Marketplace Deployment${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Select deployment target:"
    echo "1) Vercel (Frontend) + Railway (Backend)"
    echo "2) Railway (Full Stack)"
    echo "3) Docker Build (Any Container Platform)"
    echo "4) Render (Manual Setup Guide)"
    echo "5) Fly.io (Full Stack)"
    echo "6) Setup Production Environment Only"
    echo "7) Exit"
    echo ""
}

# Main execution
main() {
    case "${1:-}" in
        vercel)
            setup_production_env
            deploy_vercel
            ;;
        railway)
            setup_production_env
            deploy_railway
            ;;
        docker)
            setup_production_env
            deploy_docker "${2:-generic}"
            ;;
        render)
            setup_production_env
            deploy_render
            ;;
        fly)
            setup_production_env
            deploy_fly
            ;;
        env)
            setup_production_env
            ;;
        --help|-h)
            echo "x402 AI Marketplace Deployment Script"
            echo ""
            echo "Usage: ./deploy.sh [PLATFORM]"
            echo ""
            echo "Platforms:"
            echo "  vercel    - Deploy frontend to Vercel"
            echo "  railway   - Deploy backend to Railway"  
            echo "  docker    - Build Docker images"
            echo "  render    - Show Render setup guide"
            echo "  fly       - Deploy to Fly.io"
            echo "  env       - Setup production environment only"
            echo ""
            ;;
        "")
            show_menu
            read -p "Choose option (1-7): " choice
            case $choice in
                1) main vercel ;;
                2) main railway ;;
                3) main docker ;;
                4) main render ;;
                5) main fly ;;
                6) main env ;;
                7) exit 0 ;;
                *) print_error "Invalid option" ; exit 1 ;;
            esac
            ;;
        *)
            print_error "Unknown platform: $1"
            print_error "Use --help for usage information"
            exit 1
            ;;
    esac
    
    print_status "🎉 Deployment process complete!"
    print_warning "Don't forget to:"
    echo "  - Update environment variables on your platform"
    echo "  - Test the deployment with real transactions"
    echo "  - Monitor logs for any issues"
    echo "  - Update DNS/domain settings if needed"
}

# Run main function with all arguments
main "$@"