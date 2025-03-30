# Cymulate Phishing Simulation Platform
![image](https://github.com/user-attachments/assets/2a49a9ac-7f91-48fd-b647-489bfe8dde5b)
![image](https://github.com/user-attachments/assets/f66865cd-c497-4e32-8a46-d8d51fe5dafe)
![image](https://github.com/user-attachments/assets/caa9647b-b511-403c-aa3e-7ba365bf3d25)
![image](https://github.com/user-attachments/assets/b89bcb60-7c21-4de1-a945-fe19ae3d3d40)
![image](https://github.com/user-attachments/assets/82d4f08b-7f4a-47f0-8017-15f51052d755)

## Table of Contents
1. [Quick Deployment](#quick-deployment)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Development Guide](#development-guide)
5. [API Reference](#api-reference)

## Quick Deployment

There are two ways to deploy the Cymulate Phishing Simulation Platform:

### Option 1: Docker (Recommended)

1. Copy the docker-compose example file:
```bash
cp docker-compose.example.yml docker-compose.yml
```

2. Update the MongoDB credentials in `docker-compose.yml`:
```yaml
x-mongodb-credentials:
  MONGO_INITDB_ROOT_USERNAME: your_mongodb_username
  MONGO_INITDB_ROOT_PASSWORD: your_mongodb_password
  MONGO_DB_NAME: your_database_name
```

3. Create environment files for each service by copying the example files:
```bash
cp phishing-attempts-management-server/.env.example phishing-attempts-management-server/.env
cp phishing-simulation-server/.env.example phishing-simulation-server/.env
cp frontend/.env.example frontend/.env
```

> **Note**: If there is no `.env.example` for a service, it means the base file doesn't include any secrets.

4. Update the .env files with your real environment variables.

5. Start the services using the rebuild-and-run.sh script:
```bash
chmod +x rebuild-and-run.sh && ./rebuild-and-run.sh
```

Alternatively, you can use docker-compose directly:
```bash
docker-compose up -d
```

### Access Points For Docker
- Management API: http://localhost:3000
- Simulation API: http://localhost:7000
- Frontend: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### Option 2: Manual Setup with Node.js

1. **Prerequisites**
   - Node.js (v16 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Environment Setup**
   - Copy each .env.example to .env and update with your configuration:
   ```bash
   cp frontend/.env.example frontend/.env
   cp phishing-attempts-management-server/.env.example phishing-attempts-management-server/.env
   cp phishing-simulation-server/.env.example phishing-simulation-server/.env
   ```

3. **MongoDB Connection**
   - Ensure you have a MongoDB instance running
   - Set the `EXTERNAL_MONGODB_URI` in both server .env files

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on port 5173
   ```

5. **Management Server Setup**
   ```bash
   cd phishing-attempts-management-server
   npm install
   npm run start:dev
   ```

6. **Simulation Server Setup**
   ```bash
   cd phishing-simulation-server
   npm install
   npm run start:dev
   ```

> **Note**: The shared library is hosted on npm servers and is automatically installed as a dependency when needed.

### Required Environment Variables

For both Docker and manual deployment, you need to configure the following environment variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://username:password@localhost:27017/database_name?authSource=admin
EXTERNAL_MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.example.mongodb.net/DBNAME

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
SMTP_FROM=noreply@example.com

# Server Ports
PORT=3000 # Management server
PORT=7000 # Simulation server

# Frontend Configuration
VITE_API=http://localhost:3000
```

## Project Overview

A phishing simulation platform built with React, NestJS, and MongoDB. Test your organization's security awareness through simulated phishing campaigns.

### Tech Stack
- Frontend: React, TailwindCSS, Vite, TypeScript
- Backend: NestJS, MongoDB, JWT Auth
- Email: Nodemailer
- Containerization: Docker & Docker Compose

## Architecture

### System Components
1. **Frontend**: React application for managing phishing campaigns
2. **Management Server**: Core business logic and user management
3. **Simulation Server**: Email sending and tracking
4. **Shared Library**: Common code and types

### Communication Flow
![image](https://github.com/user-attachments/assets/57d03b25-55a9-4fd3-aa04-672f4a35200a)


1. Frontend → Management Server (all operations)
2. Management Server → Simulation Server (new campaigns)
3. Simulation Server → Database (status updates)
4. Frontend ← Database (real-time updates)

## Development Guide

### Project Structure
```
cymulate/
├── frontend/                   # React frontend application
├── phishing-attempts-management-server/  # Main API server
├── phishing-simulation-server/  # Email simulation server
├── shared-lib/                 # Shared library package
└── docker-compose.yml          # Docker configuration
```

> **Note**: The shared library is hosted on npm servers and is automatically installed as a dependency when needed.

## API Reference

### Management Server Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user
- `GET /auth/me` - Get user profile
- `GET /simulations` - List simulations
- `POST /simulations` - Create simulation

### Simulation Server Endpoints
- `POST /phishing/send` - Send phishing email
- `GET /phishing/:id/token/:token` - Validate click
