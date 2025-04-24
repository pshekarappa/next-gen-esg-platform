# ESG Platform Document Service

This is the document service for the Next-Gen ESG Platform, built with Python, FastAPI, and ChromaDB. It processes PDF documents, extracts text, and provides semantic search capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The Document Service is a backend service that handles PDF document processing and text retrieval for the ESG Platform. It extracts text from PDFs, breaks it into manageable chunks, creates embeddings using sentence transformers, and stores them in ChromaDB for semantic search.

## 💻 Tech Stack

- **Python**: Programming language
- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **PyMuPDF**: Library for PDF text extraction
- **Sentence Transformers**: For creating text embeddings
- **ChromaDB**: Vector database for storing embeddings

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **virtualenv** (recommended for creating isolated Python environments)

You can check your current versions with:

```bash
python --version
pip --version
```

## 🚀 Getting Started

Follow these simple steps to get your development environment set up:

### 1. Set up a virtual environment

First, navigate to the document-service directory:

```bash
cd document-service
```

Create a virtual environment:

```bash
# On Windows
python -m venv venv

# On macOS/Linux
python3 -m venv venv
```

Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

You should see `(venv)` in your terminal, indicating the virtual environment is active.

### 2. Install dependencies

Install all required packages:

```bash
pip install -r requirements.txt
```

### 3. Start the service

Run the service in development mode:

```bash
python run.py
```

The service will start on http://localhost:8000, and you'll see:

```
Starting Document Service on port 8000...
```

You can test that the service is running by opening http://localhost:8000 in your browser or with curl:

```bash
curl http://localhost:8000
```

You should see a response: `{"status":"Document Service is running"}`

## 📁 Project Structure

```
document-service/
├── main.py              # Main FastAPI application
├── run.py               # Script to run the service
├── requirements.txt     # Project dependencies
├── pdf_processor.py     # PDF text extraction functions
├── embedding_store.py   # Vector database and embedding functions
├── chroma_db/           # ChromaDB persistence directory
├── pdfs/                # Directory for PDF storage
└── test_service.py      # Test script for the service
```

### Key Files and Modules

- **main.py**: Contains the FastAPI application and endpoint definitions
- **pdf_processor.py**: Handles PDF text extraction and chunking
- **embedding_store.py**: Manages the vector database and search functionality
- **run.py**: Simple script to start the service with Uvicorn

## 🔄 API Endpoints

The document service provides the following API endpoints:

- **GET /**: Check if the service is running
- **GET /health**: Health check endpoint
- **POST /upload**: Upload a PDF file for processing
- **POST /setup**: Process all PDFs in a specified directory
- **GET /status/{job_id}**: Check the status of a processing job
- **POST /search**: Search for document chunks relevant to a query

## 👨‍💻 Development Guide

### Understanding the Service Flow

1. **Document Processing**:

   - PDFs are uploaded or located in the `pdfs` directory
   - Text is extracted using PyMuPDF
   - Text is cleaned and chunked into smaller segments
   - Document metadata is extracted

2. **Embedding Creation**:

   - Text chunks are converted to embeddings using Sentence Transformers
   - Embeddings and metadata are stored in ChromaDB

3. **Document Search**:
   - User queries are converted to embeddings
   - Similar document chunks are retrieved from ChromaDB
   - Results are returned with relevant metadata

### Making Changes

#### Adding New Functionality to the PDF Processor

1. Open `pdf_processor.py`
2. Add your new function or modify existing ones
3. Import and use your changes in `main.py` if needed

Example:

```python
# In pdf_processor.py
def extract_tables_from_pdf(pdf_path: str) -> List[Dict]:
    """Extract tables from a PDF file."""
    # Your implementation here
    pass

# In main.py - import and use the new function
from pdf_processor import extract_tables_from_pdf
```

#### Modifying the API

1. Open `main.py`
2. Add or modify FastAPI endpoint definitions

Example for adding a new endpoint:

```python
@app.get("/document/{doc_id}")
def get_document(doc_id: str):
    """Get information about a specific document."""
    # Implementation
    return {"document_id": doc_id, "status": "found"}
```

## 🧪 Testing

To manually test the service endpoints:

### Health Check

```bash
curl http://localhost:8000/health
```

### Upload a PDF

```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@path/to/your/document.pdf"
```

### Search Documents

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "ESG policies", "n_results": 3}'
```

## ❓ Troubleshooting

### Common Issues

1. **Installation errors with PyMuPDF or Sentence Transformers**:

   - Make sure you have the required system libraries
   - On Linux, you might need additional packages: `apt-get install build-essential python3-dev`
   - Try installing packages individually: `pip install PyMuPDF==1.22.5`

2. **Service doesn't start**:

   - Check if the port 8000 is already in use
   - Verify your Python version (should be 3.8+)
   - Make sure all dependencies are correctly installed

3. **PDF processing fails**:

   - Check if the PDF is corrupted or password-protected
   - Verify that you have enough disk space
   - Look for error logs in the console output

4. **Search returns no results**:
   - Make sure you've processed PDFs before searching
   - Check the ChromaDB directory exists and has data
   - Try simpler search queries first

### Getting Help

If you're still having issues:

- Review the FastAPI and Sentence Transformers documentation
- Check the console for error messages
- Ask for help from team members

---

This README was last updated on November 8, 2023.
