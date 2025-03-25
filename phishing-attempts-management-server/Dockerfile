FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application including .env file
COPY . .

# Load environment variables from .env file
ENV $(cat .env | xargs)

# Create the public directory for static files
RUN mkdir -p public

# Build the application
RUN npm run build

# Use a smaller image for the production environment
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy .env file for production environment
COPY .env ./
# Set environment variables from .env file
ENV $(cat .env | xargs)

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:prod"] 