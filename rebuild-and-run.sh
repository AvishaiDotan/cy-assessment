#!/bin/bash

#chmod +x rebuild-and-run.sh && ./rebuild-and-run.sh
echo "🛑 Stopping existing containers..."
docker-compose -f main-server.docker-compose.yml down

echo "🧹 Cleaning up Docker system..."
docker system prune -f

echo "🏗️  Rebuilding containers..."
docker-compose -f main-server.docker-compose.yml build

echo "🚀 Starting containers..."
docker-compose -f main-server.docker-compose.yml up -d

echo "⏳ Waiting for containers to start..."
sleep 5

echo "📝 Following phishing-management-app logs..."
docker-compose -f main-server.docker-compose.yml logs -f phishing-management-app 