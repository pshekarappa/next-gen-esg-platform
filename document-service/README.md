# Document Service

## Overview

The Document Service is a Python-based microservice that processes PDF documents, extracts text and metadata, and creates searchable vector embeddings. It's part of a larger ESG (Environmental, Social, and Governance) platform that allows users to upload, process, and search through PDF documents.

## Features

- PDF text extraction with PyMuPDF
- Metadata extraction from PDF documents
- Text chunking for better semantic search
- Vector embeddings using Sentence Transformers
- Persistent storage of embeddings with ChromaDB
- RESTful API built with FastAPI
- Asynchronous background processing for batch operations

## Tech Stack

- Python 3.8+
- FastAPI - Web framework
- Uvicorn - ASGI server
- PyMuPDF - PDF processing
- Sentence Transformers - Text embeddings
- ChromaDB - Vector database
- Docker - Containerization

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (optional for cloning)
- Docker and Docker Compose (optional for containerized setup)

## Local Development Setup

### Step 1: Clone the Repository (if not already done)

```bash
git clone https://github.com/your-org/next-gen-esg-platform.git
cd next-gen-esg-platform
```

### Step 2: Set Up Python Virtual Environment

```bash
cd document-service
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Prepare for PDF Processing

Create directories for storing PDFs and the vector database:

```bash
mkdir -p pdfs
mkdir -p chroma_db
```

### Step 5: Run the Service

```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The service will start at http://localhost:8000. You can access the Swagger UI documentation at http://localhost:8000/docs.

## Docker Setup

### Option 1: Run Document Service Only

```bash
# Build and run the document service container
docker build -t document-service .
docker run -p 8000:8000 -v $(pwd)/pdfs:/app/pdfs -v $(pwd)/chroma_db:/app/chroma_db document-service
```

### Option 2: Run the Entire Stack with Docker Compose

```bash
# From the project root
docker-compose up
```

This will start all services including the document service, nlp service, query service, and frontend.

## API Usage Guide

### 1. Upload a PDF Document

```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your-document.pdf"
```

### 2. Process All PDFs in a Directory

```bash
curl -X POST "http://localhost:8000/setup" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{\"pdf_directory\":\"pdfs\"}"
```

### 3. Check Processing Status

```bash
curl -X GET "http://localhost:8000/status/{job_id}" \
  -H "accept: application/json"
```

Replace `{job_id}` with the job ID returned from the setup endpoint.

### 4. Search Documents

```bash
curl -X POST "http://localhost:8000/search" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"climate change\",\"n_results\":5}"
```

## Development Guide

### Project Structure

- `main.py` - FastAPI application and API endpoints
- `pdf_processor.py` - PDF text extraction and chunking
- `embedding_store.py` - Vector embedding and ChromaDB integration
- `run.py` - Simple script to run the service
- `requirements.txt` - Python dependencies
- `pdfs/` - Directory for storing PDF files
- `chroma_db/` - Directory for ChromaDB vector database

### Adding New Features

1. **Create a new endpoint**: Add route handlers in `main.py`
2. **Improve PDF processing**: Modify `pdf_processor.py`
3. **Enhance vector embeddings**: Update `embedding_store.py`

### Testing the Service

```bash
# Run the test script
python test_service.py
```

## Troubleshooting

### Common Issues

1. **PDF processing fails**:

   - Check if PyMuPDF is installed correctly
   - Ensure the PDF files are not corrupted or password-protected

2. **ChromaDB errors**:

   - Make sure the `chroma_db` directory exists and is writable
   - Check if the sentence-transformers model is installed correctly

3. **API connection issues**:
   - Verify the service is running on the expected port
   - Check CORS configuration if accessing from a browser

### Logs

Service logs are written to the console. To capture logs to a file:

```bash
python run.py > document-service.log 2>&1
```

## Integration with Other Services

The Document Service integrates with:

- **NLP Service**: For advanced language processing
- **Query Service**: For handling user queries
- **Frontend Service**: For the web user interface

## Contributing

1. Follow PEP 8 style guidelines
2. Add unit tests for new features
3. Update documentation when making changes

## License

[Your License Information]
