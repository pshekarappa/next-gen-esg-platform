# ESG Platform NLP Service

This is the Natural Language Processing (NLP) service for the Next-Gen ESG Platform. It processes natural language queries about ESG (Environmental, Social, and Governance) policies and provides relevant answers based on document content.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The NLP service acts as an intelligent layer between users and document content. It receives natural language queries, processes them, retrieves relevant document chunks from the Document Service, and uses OpenAI to generate concise, relevant answers.

## 💻 Tech Stack

- **Python 3.8+**: The programming language used
- **FastAPI**: Modern, fast web framework for building APIs
- **OpenAI API**: For natural language processing and answer generation
- **Uvicorn**: ASGI server for running the FastAPI application
- **Requests**: For making HTTP requests to the Document Service

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8 or higher**:

   - Download from [python.org](https://www.python.org/downloads/)
   - Verify installation with `python --version` or `python3 --version`

2. **Pip (Python package manager)**:

   - Usually comes with Python installation
   - Verify with `pip --version` or `pip3 --version`

3. **API Key for OpenAI**:
   - Sign up at [OpenAI](https://platform.openai.com/) if you don't have an account
   - Generate an API key from your account dashboard

## 🚀 Getting Started

Follow these simple steps to set up your local development environment:

### 1. Clone the repository (if you haven't already)

```bash
git clone https://github.com/your-organization/next-gen-esg-platform.git
cd next-gen-esg-platform
```

### 2. Navigate to the NLP service directory

```bash
cd nlp-service
```

### 3. Create a virtual environment (recommended)

This isolates your project dependencies from other Python projects.

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

You'll know the virtual environment is active when you see `(venv)` at the beginning of your command prompt.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up environment variables

Create a `.env` file in the nlp-service directory with the following:

```
OPENAI_API_KEY=your_openai_api_key_here
DOCUMENT_SERVICE_URL=http://localhost:8000
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 6. Start the service

```bash
python main.py
```

This will run the NLP service on [http://localhost:8001](http://localhost:8001) with auto-reload enabled for development.

## 📁 Project Structure

```
nlp-service/
├── main.py              # Main application code with API endpoints
├── requirements.txt     # Python dependencies
├── test_document_service.py  # Test script for document service connectivity
├── .env                 # Environment variables (you'll create this)
└── README.md            # This documentation
```

## 👨‍💻 Local Development

### Understanding the Application Flow

1. The service receives a query through the `/process_query` endpoint
2. It sends the query to the Document Service to retrieve relevant document chunks
3. It processes these chunks and formats them as context
4. It uses OpenAI to generate an answer based on the context and query
5. The answer and source chunks are returned to the client

### Making Changes

1. Modify `main.py` to adjust the API behavior
2. The server auto-reloads when you save changes
3. Test your changes by sending requests to the API

### Example Request to the API

Using curl:

```bash
curl -X POST "http://localhost:8001/process_query" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is ESG policy?", "n_results": 5}'
```

Using Python requests:

```python
import requests

response = requests.post(
    "http://localhost:8001/process_query",
    json={"query": "What is ESG policy?", "n_results": 5}
)

print(response.json())
```

## 🌐 API Endpoints

### GET /

Returns a welcome message to confirm the service is running.

**Response**:

```json
{
  "message": "Welcome to NLP Service"
}
```

### POST /process_query

Processes a natural language query and returns an answer with source information.

**Request Body**:

```json
{
  "query": "What is the company's policy on carbon emissions?",
  "n_results": 5
}
```

**Response**:

```json
{
  "answer": "The company's policy on carbon emissions...",
  "source_chunks": [
    {
      "content": "...",
      "source": "...",
      "relevance_score": 0.75
    }
  ]
}
```

## 🧪 Testing

You can test the service using the included test script:

```bash
python test_document_service.py
```

This tests the connectivity to the Document Service and helps understand the response format.

To test the NLP service directly, you can use the Swagger UI documentation available at [http://localhost:8001/docs](http://localhost:8001/docs) after starting the service.

## ❓ Troubleshooting

### Common Issues

1. **"Module not found" errors**

   - Ensure you've activated your virtual environment
   - Verify that all dependencies are installed with `pip install -r requirements.txt`

2. **OpenAI API errors**

   - Check that your API key is correct in the `.env` file
   - Verify your OpenAI account has sufficient credits

3. **Document Service connection errors**

   - Ensure the Document Service is running at the URL specified in your `.env`
   - Check network connectivity between services

4. **ModuleNotFoundError: No module named 'dotenv'**
   - Run `pip install python-dotenv` to install the missing package

### Advanced Debugging

To get more detailed error information, you can add logging by modifying `main.py`:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Then use logger.debug(), logger.info(), etc.
```

### Still Having Issues?

- Check for issues with similar services in the repository
- Consult the FastAPI documentation for API-related problems
- Review the OpenAI API documentation for model-specific issues

---

This README was last updated on November 2023.
