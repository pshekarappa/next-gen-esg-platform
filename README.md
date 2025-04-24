# Next-Gen ESG Platform

## Overview

This project is a modern ESG (Environmental, Social, and Governance) platform built with a microservices architecture. It allows users to upload, process, search, and analyze ESG documents through an intuitive web interface.

## Services

The platform consists of the following microservices:

### 1. [Document Service](./document-service/README.md)

- Handles PDF document processing, text extraction, and vector embedding
- Provides document search capabilities
- Built with Python, FastAPI, PyMuPDF, and ChromaDB

### 2. NLP Service

- Provides natural language processing capabilities
- Analyzes document content for ESG-related insights
- Built with Python, FastAPI, and OpenAI integrations

### 3. Query Service

- Orchestrates requests between frontend and backend services
- Manages complex multi-step queries
- Built with Python and FastAPI

### 4. Frontend Service

- User interface for the ESG platform
- Allows document upload, search, and visualization
- Built with React.js and modern UI libraries

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- Python 3.8+ (for local development)
- Node.js 16+ (for frontend development)

### Quick Start with Docker

The fastest way to run the entire platform is with Docker Compose:

```bash
# Clone the repository (if not already done)
git clone https://github.com/your-org/next-gen-esg-platform.git
cd next-gen-esg-platform

# Create an .env file with required environment variables
echo "OPENAI_API_KEY=your_openai_api_key" > .env

# Start all services
docker-compose up
```

Once all services are running, you can access:

- Frontend UI: http://localhost:3000
- Document Service API: http://localhost:8000/docs
- NLP Service API: http://localhost:8001/docs
- Query Service API: http://localhost:8002/docs

### Local Development

For local development, you can run each service individually. Please refer to the README in each service directory for specific instructions:

- [Document Service Setup](./document-service/README.md)
- Frontend Service: Run `npm install && npm start` in the frontend-service directory
- Other services have similar Python-based setups

## Architecture Overview

```
+----------------+
|    Frontend    |
|   (React.js)   |
+--------+-------+
         |
         v
+--------+-------+
|  Query Service  |
|    (FastAPI)    |
+--------+-------+
         |
+--------+-------+--------+
|                |        |
v                v        v
+-----------+ +--------+ +-------------+
| Document  | |  NLP   | | (Future     |
| Service   | |Service | | Services)   |
+-----------+ +--------+ +-------------+
```

## Development Guidelines

- Use consistent code formatting across services
- Write unit tests for all new features
- Document API endpoints using OpenAPI/Swagger
- Follow the microservices architecture pattern

## License

[Your License Information]
