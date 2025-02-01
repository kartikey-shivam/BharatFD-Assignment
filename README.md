# BharatFD-assignment
# BharatFd - FAQ Management System

## Overview
BharatFd is a RESTful API service for managing Frequently Asked Questions (FAQs) with built-in caching, MongoDB integration, and support for multiple languages.

### Key Features
- CRUD operations for FAQs
- Redis caching
- code sanitization (For WYSIWYG Editor)
- Multi-language support
- MongoDB database
- Docker containerization
- TypeScript support
- Automated testing

## Technology Stack
- Node.js (v18+)
- TypeScript
- Express.js
- MongoDB
- Redis
- Docker
- Jest (Testing)

## Prerequisites
- Node.js (v18+)
- Docker Desktop
- MongoDB
- Redis

## Installation

1. Clone repository:
```bash
git clone https://github.com/kartikey-shivam/bharatfd.git
cd bharatfd
npm install
```

# Development (.env)
2. NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bharatfd
REDIS_URL=redis://localhost:6379
GOOGLE_APPLICATION_CREDENTIALS=../config/translate-key.json

# Testing (.env.test)
3. NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/bharatfd_test
REDIS_URL=redis://localhost:6379
GOOGLE_APPLICATION_CREDENTIALS=../config/translate-key.json


## Translation Setup

### Google Cloud Configuration
1. Create a Google Cloud Project
2. Enable Cloud Translation API
3. Create Service Account
4. Download Service Account Key

### Credential Setup
5. Copy template to actual credentials file:
   ```bash
   copy src\config\translate-key.template.json src\config\translate-key.json

    {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "your-key-id",
      "private_key": "your-private-key",
      "client_email": "your-service-account@project.iam.gserviceaccount.com",
      "client_id": "your-client-id",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "your-cert-url",
      "universe_domain": "googleapis.com"
    }
    ```   

# Running it on localhost:3000
4. npm run dev

# Building and running production build
npm run build
npm run dev

# Running tests
5. npm test

## API Documentation
```bash
POST /api/faqs/create
Content-Type: application/json

{
  "question": "What is BharatFd?",
  "answer": "A FAQ management system",
  "isActive": true
}

# Get all FAQs
GET /api/faqs

# Get a specific FAQ
GET /api/faqs/:id

# Update a FAQ
PUT /api/faqs/:id
Content-Type: application/json

{
  "question": "Updated question",
  "answer": "Updated answer"
}


# Delete a FAQ
DELETE /api/faqs/:id

```

## Docker

# Start services
docker-compose up -d


# Stop services
docker-compose down

# View logs
docker-compose logs -f

Services
API: http://localhost:8000
MongoDB: mongodb://localhost:27017
Redis: redis://localhost:6379


## Project Structure

```bash
bharatfd/
├── src/
│   ├── config/
│   │   ├── db.config.ts
│   │   ├── sanitize.config.ts
│   │   ├── translate-key.template.json
│   │   └── translate-key.json
│   ├── controllers/
│   │   └── FAQController.ts
│   ├── middlewares/
│   │   ├── cache.ts
│   │   ├── sanitizationMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── models/
│   │   └── FAQ.ts
│   ├── routes/
│   │   └── faqRoutes.ts
│   ├── services/
│   │   └── TranslationService.ts
│   ├── validators/
│   │   └── faqValidator.ts
│   └── tests/
│       ├── integration/
│       │   └── faq.test.ts
│       └── unit/
│           ├── FAQ.test.ts
│           └── TranslationService.test.ts
├── docker/
│   ├── api.Dockerfile
│   └── redis.Dockerfile
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

# Contributing
Fork repository
Create feature branch
Commit changes
Push to branch
Create Pull Request



# BharatFD-Assignment