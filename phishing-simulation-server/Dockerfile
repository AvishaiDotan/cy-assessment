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

# Build the application
RUN npm run build

# Use a smaller image for the production environment
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Create shared-lib structure in the production image
RUN mkdir -p /app/node_modules/shared-lib

# Copy shared-lib
COPY --from=build /app/node_modules/shared-lib /app/node_modules/shared-lib

# Copy built application
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start:prod"] 