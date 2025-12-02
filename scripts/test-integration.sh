#!/bin/bash

# Test Integration Script
# This script orchestrates Docker containers for running integration tests

set -e

echo "🚀 Starting integration test environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean up function
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    docker compose -f docker-compose.test.yml down -v --remove-orphans
}

# Set up trap to clean up on exit
trap cleanup EXIT

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Stop any existing containers
echo -e "${YELLOW}📦 Stopping any existing containers...${NC}"
docker compose -f docker-compose.test.yml down -v --remove-orphans 2>/dev/null || true

# Build and start containers
echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker compose -f docker-compose.test.yml up -d --build

# Wait for API to be healthy
echo -e "${YELLOW}⏳ Waiting for API to be healthy...${NC}"
max_attempts=60
attempt=0
until docker compose -f docker-compose.test.yml exec -T wedding-api curl -sf http://localhost:8080/actuator/health > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo -e "${RED}❌ API failed to start within timeout${NC}"
        docker compose -f docker-compose.test.yml logs wedding-api
        exit 1
    fi
    echo "  Waiting for API... ($attempt/$max_attempts)"
    sleep 2
done

echo -e "${GREEN}✅ API is healthy!${NC}"

# Run backend tests
echo -e "\n${YELLOW}🧪 Running backend tests...${NC}"
cd wedding-api
./mvnw test -DskipTests=false || {
    echo -e "${RED}❌ Backend tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backend tests passed!${NC}"

# Run frontend tests
echo -e "\n${YELLOW}🧪 Running frontend tests...${NC}"
cd ../wedding-new
pnpm test --passWithNoTests || {
    echo -e "${RED}❌ Frontend tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Frontend tests passed!${NC}"

# Run integration tests (API available)
echo -e "\n${YELLOW}🧪 Running integration tests...${NC}"
NEXT_PUBLIC_API_URL=http://localhost:8081 pnpm test --passWithNoTests || {
    echo -e "${RED}❌ Integration tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Integration tests passed!${NC}"

echo -e "\n${GREEN}🎉 All integration tests passed!${NC}"
