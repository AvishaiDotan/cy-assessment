# Base image for building
FROM node:18-alpine AS builder

WORKDIR /app

# Step 1: Build the Frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Build the NestJS Backend
WORKDIR /app/phishing-attempts-management-server
COPY phishing-attempts-management-server/package*.json ./
RUN npm install
COPY phishing-attempts-management-server/ ./
RUN npm run build

# Create a 'public' folder in the dist folder inside the NestJS build
RUN mkdir -p /app/phishing-attempts-management-server/dist/public
# Copy the built frontend files
RUN cp -R /app/frontend/dist/* /app/phishing-attempts-management-server/dist/public/

# Step 3: Start with a fresh image for the production environment
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies in the runtime environment
COPY phishing-attempts-management-server/package*.json ./
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/phishing-attempts-management-server/dist ./dist
COPY --from=builder /app/phishing-attempts-management-server/dist/public ./dist/public

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:prod"]