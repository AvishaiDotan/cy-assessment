# Shared Library

A shared TypeScript library providing common types, services, and helpers for microservices.

## Features
- Zod schemas and type definitions
- AES Encryption Service
- Database Service
- Environment variables management

## Installation

```bash
npm install github:your-username/shared-lib
```

## Usage

1. Create a `.env` file in your project root:
```env
ENCRYPTION_KEY=your-secret-key
DB_CONNECTION_STRING=your-database-connection-string
```

2. Import and use the services:
```typescript
import { EncryptionService, DbService, User, UserSchema } from 'shared-lib';

// Using the Encryption Service
const encryptionService = new EncryptionService();
const encrypted = encryptionService.encrypt('sensitive data');
const decrypted = encryptionService.decrypt(encrypted);

// Using the DB Service
const dbService = new DbService();
await dbService.connect();

// Using Types and Schemas
const userData = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe'
};

const validatedUser = UserSchema.parse(userData);
const user: User = validatedUser;
```

## Environment Variables
The following environment variables are required:
- `ENCRYPTION_KEY`: Secret key for AES encryption
- `DB_CONNECTION_STRING`: Database connection string

## Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build` # shared
