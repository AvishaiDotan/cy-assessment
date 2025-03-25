# cy-test
# cy_
# cy_
# cy-assessment

# Phishing Simulation System

This project contains multiple services working together:
- Frontend (React application)
- Phishing Attempts Management Server (NestJS)
- Phishing Simulation Server (NestJS)
- Shared Library (Common code)

## Docker Setup

### Option 1: Running with Docker Compose

1. Build and run all services:
```bash
docker-compose up --build
```

2. Access the services:
   - Frontend: http://localhost:5000
   - Management API: http://localhost:3000
   - Simulation API: http://localhost:3001

### Option 2: Serving Frontend from Management Server

1. First, copy the frontend build to the management server:
```bash
./copy-frontend-build.sh
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build phishing-management-server phishing-simulation-server
```

3. Access the application:
   - Frontend + API: http://localhost:3000
   - Simulation API: http://localhost:3001

## Development Setup

1. Install dependencies for all projects:
```bash
cd shared-lib && npm install && npm run build
cd ../frontend && npm install
cd ../phishing-attempts-management-server && npm install
cd ../phishing-simulation-server && npm install
```

2. Run the services in development mode:
```bash
# Terminal 1
cd phishing-attempts-management-server && npm run start:dev

# Terminal 2
cd phishing-simulation-server && npm run start:dev

# Terminal 3
cd frontend && npm run dev
```
