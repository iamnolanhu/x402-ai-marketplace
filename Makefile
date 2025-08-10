# x402 AI Marketplace - Development & Deployment Makefile

.PHONY: help dev build start clean docker-dev docker-prod docker-down health demo check setup

# Default target
help:
	@echo "x402 AI Marketplace - Available Commands:"
	@echo ""
	@echo "🚀 Quick Start:"
	@echo "  make demo          - One-command demo setup"
	@echo "  make dev           - Start development servers"
	@echo "  make docker-dev    - Start with Docker (development)"
	@echo "  make docker-prod   - Deploy with Docker (production)"
	@echo ""
	@echo "🔧 Development:"
	@echo "  make setup         - Initial project setup"
	@echo "  make build         - Build all projects"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make install       - Install dependencies"
	@echo "  make check         - System health checks"
	@echo ""
	@echo "🐳 Docker Operations:"
	@echo "  make docker-build  - Build Docker images"
	@echo "  make docker-down   - Stop Docker services"
	@echo "  make docker-clean  - Clean Docker resources"
	@echo "  make docker-logs   - View Docker logs"
	@echo ""
	@echo "🩺 Monitoring:"
	@echo "  make health        - Check service health"
	@echo "  make logs          - View application logs"
	@echo "  make status        - Show service status"

# Quick demo setup
demo:
	@echo "🎯 Starting x402 AI Marketplace Demo..."
	./start.sh

# Development
dev:
	@echo "🔧 Starting development servers..."
	npm run dev

setup:
	@echo "⚙️ Setting up project..."
	npm install
	npm run install:all
	cp .env.example .env
	@echo "✅ Setup complete! Please edit .env with your actual values."

install:
	@echo "📦 Installing dependencies..."
	npm install
	npm run install:all

build:
	@echo "🏗️ Building projects..."
	npm run build

clean:
	@echo "🧹 Cleaning build artifacts..."
	npm run clean
	rm -rf node_modules/*/node_modules

check:
	@echo "🩺 Running system checks..."
	./start.sh --check-only

# Docker operations
docker-dev:
	@echo "🐳 Starting Docker development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

docker-prod:
	@echo "🐳 Deploying Docker production environment..."
	docker-compose up --build -d

docker-build:
	@echo "🔨 Building Docker images..."
	docker-compose build

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f

docker-logs:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

# Health and monitoring
health:
	@echo "🩺 Checking service health..."
	@curl -f http://localhost:3001/health || echo "❌ Backend unhealthy"
	@curl -f http://localhost:3000 >/dev/null 2>&1 && echo "✅ Frontend healthy" || echo "❌ Frontend unhealthy"

logs:
	@echo "📋 Viewing application logs..."
	npm run logs

status:
	@echo "📊 Service Status:"
	@lsof -ti:3000 >/dev/null && echo "✅ Frontend (3000): Running" || echo "❌ Frontend (3000): Stopped"
	@lsof -ti:3001 >/dev/null && echo "✅ Backend (3001): Running" || echo "❌ Backend (3001): Stopped"

# Production deployment helpers
deploy-staging:
	@echo "🚀 Deploying to staging..."
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

deploy-prod:
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Backup and restore
backup:
	@echo "💾 Creating backup..."
	docker-compose exec redis redis-cli BGSAVE
	tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz .env logs/

# Testing
test:
	@echo "🧪 Running tests..."
	npm test

test-integration:
	@echo "🧪 Running integration tests..."
	npm run test:integration

# Quality checks  
lint:
	@echo "🔍 Running linters..."
	npm run lint

security-scan:
	@echo "🔒 Running security scan..."
	npm audit
	
# Development helpers
reset:
	@echo "🔄 Resetting development environment..."
	make clean
	make docker-clean
	make setup
	
restart:
	@echo "🔄 Restarting services..."
	make docker-down
	make docker-dev

# Environment management
env-check:
	@echo "🔍 Checking environment configuration..."
	@test -f .env || (echo "❌ .env file missing" && exit 1)
	@grep -q "PRIVATE_KEY=0x" .env || (echo "⚠️ Update PRIVATE_KEY in .env" && exit 1)
	@grep -q "CDP_API_KEY_ID=your_" .env && (echo "⚠️ Update CDP credentials in .env" && exit 1) || true
	@echo "✅ Environment configuration looks good"