# Phishing Simulation Platform

A comprehensive platform for conducting and managing phishing simulation campaigns, built with modern web technologies and best practices.

## Overview

This platform consists of four main components working together to provide a complete phishing simulation solution:

- **Frontend**: A React-based web application for managing phishing campaigns and viewing results
- **Management Server**: A NestJS backend service handling user authentication and campaign management
- **Simulation Server**: A NestJS backend service responsible for executing phishing simulations
- **Shared Library**: Common code and utilities shared across all components

## Tech Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Vite
  - TailwindCSS
  - React Router DOM

- **Backend**:
  - NestJS 11
  - TypeScript
  - MongoDB
  - JWT Authentication
  - Passport.js

## API Routes

### Management Server (Port 3000)

#### Authentication Routes
- `POST /auth/signup` - Register a new user
  - Body: `{ email: string, password: string, name: string }`
  - Returns: User object with JWT token in HTTP-only cookie

- `POST /auth/login` - Authenticate user
  - Body: `{ email: string, password: string }`
  - Returns: User object with JWT token in HTTP-only cookie

- `GET /auth/me` - Get current user profile
  - Protected route (requires JWT authentication)
  - Returns: Current user object

#### Simulation Management Routes
- `GET /simulations` - List all phishing simulations
  - Protected route
  - Returns: Array of simulation objects

- `POST /simulations` - Create new phishing simulation
  - Protected route
  - Returns: Created simulation object

### Simulation Server (Port 3001)

#### Phishing Routes
- `POST /phishing/send` - Send phishing email
  - Body: Phishing payload with email details
  - Returns: Email sending result

- `GET /phishing/:id/token/:token` - Validate phishing email
  - Protected route with token validation
  - Updates phishing attempt status
  - Returns: Updated phishing payload

## Frontend Routes

The frontend application uses React Router for navigation:

- `/login` - Login page
- `/signup` - User registration page
- `/` - Home page (protected route)
  - Redirects to login if not authenticated
- `*` - Catch-all route redirects to home

All routes except login and signup are protected and require authentication.

## Prerequisites

- Node.js (Latest LTS version recommended)
- Docker and Docker Compose
- MongoDB (if running locally)

## Getting Started

### Docker Deployment

#### Option 1: Full Stack Deployment

1. Build and run all services:
```bash
docker-compose up --build
```

2. Access the services:
   - Frontend: http://localhost:5000
   - Management API: http://localhost:3000
   - Simulation API: http://localhost:3001

#### Option 2: Integrated Frontend with Management Server

1. Copy the frontend build to the management server:
```bash
./copy-frontend-build.sh
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build phishing-management-server phishing-simulation-server
```

3. Access the application:
   - Integrated Frontend + API: http://localhost:3000
   - Simulation API: http://localhost:3001

### Local Development

1. Install dependencies for all projects:
```bash
# Build shared library first
cd shared-lib && npm install && npm run build

# Install frontend dependencies
cd ../frontend && npm install

# Install management server dependencies
cd ../phishing-attempts-management-server && npm install

# Install simulation server dependencies
cd ../phishing-simulation-server && npm install
```

2. Start the development servers:

```bash
# Terminal 1 - Management Server
cd phishing-attempts-management-server && npm run start:dev

# Terminal 2 - Simulation Server
cd phishing-simulation-server && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```
