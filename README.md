# Cymulate Phishing Simulation Platform
![image](https://github.com/user-attachments/assets/2a49a9ac-7f91-48fd-b647-489bfe8dde5b)
![image](https://github.com/user-attachments/assets/f66865cd-c497-4e32-8a46-d8d51fe5dafe)

![image](https://github.com/user-attachments/assets/caa9647b-b511-403c-aa3e-7ba365bf3d25)
![image](https://github.com/user-attachments/assets/b89bcb60-7c21-4de1-a945-fe19ae3d3d40)

## Project Overview

This project is a comprehensive phishing simulation platform designed to help organizations test their security awareness through simulated phishing campaigns. The platform allows users to create, manage, and track phishing simulation attempts while providing valuable insights into employee security awareness.

The application consists of two separate NestJS servers and a React frontend, communicating with a MongoDB database.

## Main Services

### 1. Frontend

A React-based web application that provides an intuitive user interface for managing phishing simulations. It allows users to:
- Register and login with secure JWT authentication
- Create and configure phishing campaigns by specifying target emails
- View simulation results and analytics in a comprehensive table
- Track phishing attempt status in real-time

**Key Features**:
- User authentication (login/registration)
- Phishing simulation creation form
- Real-time status updates for phishing attempts
- Responsive design with modern UI

**Technologies**: React, TailwindCSS, Vite, TypeScript

### 2. Phishing Attempts Management Server

This service manages the core business logic for phishing simulations, including:
- User authentication
- Storing and retrieving phishing campaign data
- Managing simulation results and analytics
- Communication with the Phishing Simulation Server

**Endpoints**:
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate a user
- `GET /auth/me` - Get current user profile
- `GET /simulations` - Get all simulations for the authenticated user
- `POST /simulations` - Create a new phishing simulation (communicates with Phishing Simulation Server)

**Technologies**: NestJS, MongoDB, JWT Authentication, TypeScript

### 3. Phishing Simulation Server

This service handles the actual sending of phishing emails and tracking of user interactions:
- Sends customized phishing emails to targets
- Tracks when targets open emails or click links
- Records and validates phishing attempt results
- Updates simulation status in the database

**Endpoints**:
- `POST /phishing/send` - Send a phishing email with tracking link
- `GET /phishing/:id/token/:token` - Endpoint for validating when a recipient clicks a phishing link

**Technologies**: NestJS, Nodemailer, MongoDB, TypeScript

### 4. Shared Library

A common library that provides shared functionality across services:
- Common data types and interfaces
- Shared schemas for MongoDB
- Utility services and functions

## Running the Project

### Development Mode

1. **Setup environment variables**:
   - Copy the `.env.example` files in each service directory to `.env` and configure accordingly

2. **Install dependencies**:
   ```bash
   
   # Install backend dependencies
   cd ../phishing-attempts-management-server
   npm install
   
   # Install simulation server dependencies
   cd ../phishing-simulation-server
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the services**:
   ```bash
   # Start the management server
   cd phishing-attempts-management-server
   npm run start:dev
   
   # Start the simulation server
   cd ../phishing-simulation-server
   npm run start:dev
   
   # Start the frontend
   cd ../frontend
   npm run dev
   ```

### Docker Development Mode

To run the entire stack in Docker:

1. **Start all services**:
   ```bash
   docker-compose up
   ```

2. **Rebuild containers** (if needed):
   ```bash
   ./rebuild.sh
   ```

The application will be available at:
- Frontend: http://localhost:5000
- Management API: http://localhost:3001
- Simulation API: http://localhost:7000
- MongoDB: mongodb://localhost:27017

## Architecture

### System Communication Flow

1. The frontend communicates with the Phishing Attempts Management Server for all operations
2. When a new phishing simulation is created, the Management Server sends a request to the Phishing Simulation Server
3. The Phishing Simulation Server sends the email and updates the attempt status in the database
4. When a recipient clicks a link, the Phishing Simulation Server updates the status in the database
5. Status updates are reflected in real-time on the frontend

### Repository Pattern

The project implements the repository pattern to decouple the business logic from the data access layer:
- Each service contains repositories that handle data operations
- This enables better testability and maintainability
- Repositories abstract the database interactions

### Shared Library

The shared library (`@avishaidotan/shared-lib`) provides:
- Common data types and interfaces used across services
- Shared MongoDB schemas
- Utility services
- This ensures consistency across the codebase and reduces duplication

### Technologies

- **Backend**: NestJS (TypeScript-based Node.js framework)
- **Database**: MongoDB
- **Frontend**: React with Vite and TailwindCSS
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Containerization**: Docker and Docker Compose
- **Email**: Nodemailer for sending phishing simulation emails
- **Language**: TypeScript throughout the entire stack

## Project Structure

```
cymulate/
├── frontend/                   # React frontend application
├── phishing-attempts-management-server/  # Main API server
├── phishing-simulation-server/  # Email simulation server
├── shared-lib/                 # Shared library package
└── docker-compose.yml          # Docker configuration
```
