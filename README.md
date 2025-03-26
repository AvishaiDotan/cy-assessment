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

### Option 1: Docker (Recommended)

1. First, copy the docker-compose example file:
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

3. Create environment files for each service:
   - Copy `.env.example` to `.env` in `./phishing-attempts-management-server/`
   - Copy `.env.example` to `.env` in `./phishing-simulation-server/`

4. Start the services:
```bash
docker-compose up -d
```

### Access Points For Docker
- Management API: http://localhost:3000
- Simulation API: http://localhost:7000
- MongoDB: mongodb://localhost:27017

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js (v16 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **MongoDB Setup**
   ```bash
   # Start MongoDB (if not running as a service)
   mongod --dbpath /path/to/data/db
   ```

3. **Management Server Setup**
   ```bash
   cd phishing-attempts-management-server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run start:dev
   ```

4. **Simulation Server Setup**
   ```bash
   cd phishing-simulation-server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run start:dev
   ```

### Required Environment Variables

For both Docker and manual deployment, you need to configure the following environment variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://username:password@localhost:27017/database_name?authSource=admin

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=24h

# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=your_email@gmail.com

# Server Ports
MANAGEMENT_SERVER_PORT=3000
SIMULATION_SERVER_PORT=7000
```

> **Note**: For Gmail, you'll need to use an App Password instead of your regular password. Generate one in your Google Account settings under Security > 2-Step Verification > App passwords.

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

### Environment Setup
1. Copy `.env.example` to `.env` in each service
2. Configure MongoDB connection
3. Set up email credentials
4. Configure JWT secrets

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
