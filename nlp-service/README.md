# ESG Platform NLP Service

This is the Natural Language Processing (NLP) service for the Next-Gen ESG Platform, built with Python, FastAPI, and OpenAI integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The NLP service provides natural language processing capabilities for the ESG Platform, allowing users to query ESG (Environmental, Social, and Governance) data using natural language. It processes user queries, retrieves relevant document chunks from the Document Service, and uses OpenAI's GPT models to generate accurate responses based on the retrieved information.

## 💻 Tech Stack

- **Python**: The primary programming language (3.8+ recommended)
- **FastAPI**: A modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for serving FastAPI applications
- **OpenAI API**: For advanced language processing capabilities
- **Pydantic**: Data validation and settings management
- **Requests**: For making HTTP requests to other services

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** (v3.8 or higher)
- **pip** (Python package installer)

You can check your current versions with:

```bash
python --version
pip --version
```

## 🚀 Getting Started

Follow these simple steps to get your development environment set up:

### 1. Clone the repository (if you haven't already)

```bash
git clone https://github.com/your-organization/next-gen-esg-platform.git
cd next-gen-esg-platform
```

### 2. Navigate to the NLP service directory

```bash
cd nlp-service
```

### 3. Create a virtual environment

Creating a virtual environment keeps your dependencies isolated:

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

You'll know your virtual environment is active when you see `(venv)` at the beginning of your command prompt.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up environment variables

Create a `.env` file in the nlp-service directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
DOCUMENT_SERVICE_URL=http://localhost:8000
```

Replace `your_openai_api_key_here` with your actual OpenAI API key. You can get one from [OpenAI's website](https://platform.openai.com/account/api-keys).

### 6. Start the development server

```bash
python main.py
```

This will start the server on http://localhost:8001 with automatic reload enabled whenever you make changes to the code.

Alternatively, you can use uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 📁 Project Structure

```
nlp-service/
├── main.py              # Main application file
├── requirements.txt     # Project dependencies
├── test_document_service.py  # Test script for document service integration
└── .gitignore          # Git ignore file
```

## 👨‍💻 Development Guide

### Understanding the Code Flow

1. **Request Handling**: The service receives a query through the `/process_query` endpoint.
2. **Document Retrieval**: It sends the query to the Document Service to retrieve relevant text chunks.
3. **Context Processing**: The service processes the retrieved chunks to extract meaningful context.
4. **Answer Generation**: It uses OpenAI's GPT model to generate an answer based on the context and query.
5. **Response Formatting**: The response is formatted and returned to the client.

### Adding a New Endpoint

1. Define your request and response models using Pydantic:

```python
class MyRequestModel(BaseModel):
    field1: str
    field2: Optional[int] = None

class MyResponseModel(BaseModel):
    result: str
    status: bool
```

2. Create your endpoint in main.py:

```python
@app.post("/my_endpoint", response_model=MyResponseModel)
async def my_endpoint(request: MyRequestModel):
    # Your logic here
    return {"result": "Processed data", "status": True}
```

### Working with OpenAI

The service uses OpenAI's API for processing natural language. Here's an example of how it's used:

```python
# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create a completion
completion = client.chat.completions.create(
    model="gpt-4",  # or another model like "gpt-3.5-turbo"
    messages=[
        {"role": "system", "content": "Your system prompt here"},
        {"role": "user", "content": "User query here"}
    ],
    temperature=0.7  # Controls randomness: lower = more deterministic
)

# Extract the response
answer = completion.choices[0].message.content
```

## 🔄 API Endpoints

### 1. Root Endpoint

- **URL**: `/`
- **Method**: GET
- **Description**: Provides a welcome message, useful for checking if the service is running.
- **Response**: `{"message": "Welcome to NLP Service"}`

### 2. Process Query

- **URL**: `/process_query`
- **Method**: POST
- **Description**: Processes a natural language query and returns an answer based on relevant document chunks.
- **Request Body**:
  ```json
  {
    "query": "What is ESG policy?",
    "n_results": 5 // Optional, defaults to 5
  }
  ```
- **Response**:
  ```json
  {
    "answer": "Generated answer text here...",
    "source_chunks": [
      {
        "content": "Document chunk content...",
        "source": "Source document name",
        "relevance_score": 0.85
      }
      // More chunks...
    ]
  }
  ```

## 🔐 Environment Variables

| Variable             | Description                 | Default               |
| -------------------- | --------------------------- | --------------------- |
| OPENAI_API_KEY       | Your OpenAI API key         | None (Required)       |
| DOCUMENT_SERVICE_URL | URL of the Document Service | http://localhost:8000 |

## 🧪 Testing

You can test the integration with the Document Service using the provided test script:

```bash
python test_document_service.py
```

This script:

1. Sends a test query to the Document Service
2. Checks if the response is successful
3. Analyzes the structure of the response

## ❓ Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**

   - **Error**: `openai.error.AuthenticationError: Incorrect API key provided`
   - **Solution**: Make sure your `.env` file contains the correct API key.

2. **Document Service Connection Issues**

   - **Error**: `requests.exceptions.ConnectionError: Failed to establish a connection`
   - **Solution**: Ensure that the Document Service is running and accessible at the URL specified in your `.env` file.

3. **Import Errors**

   - **Error**: `ModuleNotFoundError: No module named 'package_name'`
   - **Solution**: Make sure you've installed all requirements with `pip install -r requirements.txt` in your virtual environment.

4. **Uvicorn Issues**

   - **Error**: `Command 'uvicorn' not found`
   - **Solution**: Ensure uvicorn is installed: `pip install uvicorn`

### Advanced Debugging

If you need to debug the service:

1. Add print statements to track the flow:

```python
print(f"Request received: {request}")
print(f"Document service response: {document_response.status_code}")
```

2. Use FastAPI's built-in logging:

```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Processing query...")
```

### Getting Help

If you're still having issues:

1. Review the FastAPI documentation: https://fastapi.tiangolo.com/
2. Review the OpenAI API documentation: https://platform.openai.com/docs/api-reference
3. Ask for help from team members

---

This README was last updated on December 1, 2023.
