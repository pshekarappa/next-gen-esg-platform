# Next Gen ESG Platform

A microservices-based platform for processing ESG (Environmental, Social, Governance) policy queries using natural language processing.

## Architecture

The platform consists of four main microservices:

1. **Frontend Service**: React-based UI for user interaction
2. **Document Service**: Manages PDF document storage and embeddings using ChromaDB
3. **NLP Service**: Processes natural language queries using OpenAI
4. **Query Service**: Orchestrates the query flow between services

## Microservices Interaction Flow

1. User submits a query through the Frontend
2. Frontend sends the query to the Query Service
3. Query Service forwards the query to the NLP Service
4. NLP Service requests relevant document chunks from the Document Service
5. Document Service returns semantically relevant document chunks
6. NLP Service uses these chunks and OpenAI to generate a comprehensive answer
7. The answer flows back through the Query Service to the Frontend
8. Frontend displays the answer with source information to the user

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Python 3.9+ (for local backend development)
- OpenAI API key

### Environment Setup

1. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running with Docker Compose

Start all services:

```bash
docker-compose up
```

Or build and start:

```bash
docker-compose up --build
```

### Running Services Individually

#### Document Service

```bash
cd document-service
pip install -r requirements.txt
python main.py
```

#### NLP Service

```bash
cd nlp-service
pip install -r requirements.txt
python main.py
```

#### Query Service

```bash
cd query-service
pip install -r requirements.txt
python main.py
```

#### Frontend

```bash
cd frontend-service
npm install
npm start
```

## API Endpoints

### Document Service (Port 8000)

- `GET /`: Health check
- `POST /setup`: Process all PDFs in a directory
- `GET /status/{job_id}`: Get processing status
- `POST /search`: Search for relevant document chunks
- `POST /upload`: Upload a PDF file

### NLP Service (Port 8001)

- `GET /`: Health check
- `POST /process_query`: Process a natural language query

### Query Service (Port 8002)

- `GET /`: Health check
- `POST /query`: Orchestrate query processing

## Adding ESG Documents

Place PDF documents in the `document-service/pdfs` directory. Then, either:

1. Use the `/setup` endpoint to process all PDFs, or
2. Use the `/upload` endpoint to add PDFs one by one

## Development and Enhancement

### Adding New Features

1. Frontend components are in `frontend-service/src/components`
2. API services are in `frontend-service/src/services`
3. Backend logic is in the respective service directories

### Potential Enhancements

- User authentication and role-based access
- Document categorization and filtering
- Advanced query suggestions
- Query history tracking
- Interactive document viewer
- Performance analytics dashboard
