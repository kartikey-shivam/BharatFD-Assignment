# BharatFD-assignment
# BharatFd - FAQ Management System

## Overview
BharatFd is a RESTful API service for managing Frequently Asked Questions (FAQs) with built-in caching, MongoDB integration, and support for multiple languages.

### Key Features
- CRUD operations for FAQs
- Redis caching
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
git clone https://github.com/yourusername/bharatfd.git
cd bharatfd
npm install
```

# Development (.env)
2. NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bharatfd
REDIS_URL=redis://localhost:6379

# Testing (.env.test)
3. NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/bharatfd_test
REDIS_URL=redis://localhost:6379


# Running it on localhost:3000
4. npm run dev

# Building and running production build
npm run build
npm run dev

# Running tests
5. npm test

## API Documentation
```bash
POST /api/faqs
Content-Type: application/json

{
  "question": "What is BharatFd?",
  "answer": "A FAQ management system",
  "category": "general"
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
API: http://localhost:3000
MongoDB: mongodb://localhost:27017
Redis: redis://localhost:6379


```bash
bharatfd/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── tests/         # Test files
├── docker/           # Docker configuration
├── .env             # Environment variables
├── docker-compose.yml
└── package.json
```


# Contributing
Fork repository
Create feature branch
Commit changes
Push to branch
Create Pull Request

# BharatFD-Assignment