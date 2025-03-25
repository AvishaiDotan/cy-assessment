FROM node:18-alpine as build

WORKDIR /app

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

# Copy .env file
COPY .env ./

# Copy built application
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 7000

# Start the server
CMD ["npm", "run", "start:prod"] 