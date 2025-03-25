FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

ARG NODE_ENV=development

RUN if [ "$NODE_ENV" = "production" ]; then \
    cp .env.docker .env.production; \
    fi

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