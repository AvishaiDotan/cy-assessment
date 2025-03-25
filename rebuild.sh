#!/bin/bash

# Stop all containers
docker-compose down

# Rebuild the server container without cache
docker-compose build --no-cache server

# Start all containers
docker-compose up -d

# Show logs
docker-compose logs --tail=20 