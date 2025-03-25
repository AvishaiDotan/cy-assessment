FROM node:18-alpine as build

WORKDIR /app

# First create the node_modules/shared-lib directory structure
RUN mkdir -p /app/node_modules/shared-lib

# Copy shared-lib files from the shared-lib image
COPY --from=shared-lib:latest /app/dist /app/node_modules/shared-lib/dist
COPY --from=shared-lib:latest /app/package.json /app/node_modules/shared-lib/package.json

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight HTTP server to serve the static content
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built frontend from the build stage
COPY --from=build /app/dist /app

# Expose the port
EXPOSE 5000

# Start the server
CMD ["serve", "-s", ".", "-l", "5000"] 