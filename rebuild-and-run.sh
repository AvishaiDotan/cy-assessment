#!/bin/bash

#chmod +x rebuild-and-run.sh && ./rebuild-and-run.sh

echo "🗑️  Stopping existing containers and removing volumes..."
docker-compose -f docker-compose.yml down -v

echo "🧹 Cleaning up Docker system..."
docker system prune -f

echo "🏗️  Rebuilding containers..."
docker-compose -f docker-compose.yml build --no-cache

echo "🚀 Starting containers..."
docker-compose -f docker-compose.yml up -d

echo "⏳ Waiting for containers to start..."
sleep 5

echo "📝 Following phishing-management-app logs..."
docker-compose -f docker-compose.yml logs -f phishing-management-app 