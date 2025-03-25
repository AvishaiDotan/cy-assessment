#!/bin/bash

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build

# Create public directory in the management server if it doesn't exist
echo "Creating public directory in management server..."
mkdir -p ../phishing-attempts-management-server/public

# Copy the frontend build to the management server's public directory
echo "Copying frontend build to management server..."
cp -r dist/* ../phishing-attempts-management-server/public/

echo "Frontend build copied successfully!" 