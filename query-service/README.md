# Query Service

The Query Service is a FastAPI-based backend service that serves as an orchestration layer between the frontend and other backend services (NLP Service and Document Service) in the ESG platform. It processes user queries and returns relevant information.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup for Local Development](#setup-for-local-development)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Making API Requests](#making-api-requests)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

## Overview

The Query Service is responsible for:

- Receiving and processing user queries from the frontend
- Communicating with the NLP Service to process queries
- Interacting with the Document Service to retrieve document information
- Returning the processed results back to the frontend

## Prerequisites

To set up and run the Query Service locally, you'll need:

- Python 3.8 or higher
- pip (Python package manager)
- A code editor (VS Code, PyCharm, etc.)
- Basic knowledge of Python and REST APIs

## Setup for Local Development

1. **Clone the Repository**

   If you haven't already, clone the repository containing the Query Service.

2. **Create a Virtual Environment**

   It's recommended to use a virtual environment to avoid conflicts with other Python projects:

   ```bash
   # Navigate to the query-service directory
   cd path/to/query-service

   # Create a virtual environment
   python -m venv venv

   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**

   With the virtual environment activated, install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the query-service directory with the following content:

   ```
   NLP_SERVICE_URL=http://localhost:8001
   DOCUMENT_SERVICE_URL=http://localhost:8000
   ```

   Adjust the URLs if your services are running on different ports.

## Running the Service

To run the Query Service locally:

1. **Ensure the Virtual Environment is Activated**

   Make sure your virtual environment is activated as shown in the setup steps.

2. **Start the Service**

   ```bash
   # From the query-service directory
   python main.py
   ```

   This will start the service on `http://localhost:8002`.

3. **Verify the Service is Running**

   Open your browser and navigate to `http://localhost:8002`. You should see a JSON response:

   ```json
   { "message": "ESG Query Service is running" }
   ```

   You can also check the health endpoint at `http://localhost:8002/health`.

## API Endpoints

The Query Service exposes the following endpoints:

### 1. Root Endpoint

- **URL**: `/`
- **Method**: GET
- **Description**: Verifies that the service is running
- **Response**: `{"message": "ESG Query Service is running"}`

### 2. Health Check

- **URL**: `/health`
- **Method**: GET
- **Description**: Checks the health of the service and its dependencies
- **Response**: Status of all services

### 3. Query Processing

- **URL**: `/query`
- **Method**: POST
- **Description**: Processes user queries and returns relevant information
- **Request Body**:
  ```json
  {
    "query": "Your question here",
    "n_results": 5,
    "include_metadata": true
  }
  ```
- **Response**: Query answer with source chunks and optional metadata

## Making API Requests

### Using cURL

```bash
# Health check
curl http://localhost:8002/health

# Process a query
curl -X POST http://localhost:8002/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ESG?", "n_results": 3}'
```

### Using Python Requests

```python
import requests

# Health check
response = requests.get("http://localhost:8002/health")
print(response.json())

# Process a query
response = requests.post(
    "http://localhost:8002/query",
    json={"query": "What is ESG?", "n_results": 3}
)
print(response.json())
```

## Development Guide

### Project Structure

The Query Service consists of the following key files:

- `main.py`: The main application file containing the FastAPI app and endpoints
- `requirements.txt`: Lists all Python dependencies
- `.env`: Environment variables (needs to be created)

### Adding New Endpoints

To add a new endpoint to the Query Service:

1. Open `main.py` in your editor
2. Define a new function with the appropriate FastAPI decorator:

   ```python
   @app.get("/new-endpoint")
   def new_endpoint():
       return {"message": "This is a new endpoint"}
   ```

3. Save the file and restart the service

### Making Changes to Existing Endpoints

To modify an existing endpoint:

1. Locate the endpoint function in `main.py`
2. Make your changes
3. Save the file and restart the service

### Adding New Dependencies

If your changes require new Python packages:

1. Install the package within your virtual environment:

   ```bash
   pip install package-name
   ```

2. Add the package to `requirements.txt`:
   ```bash
   pip freeze > requirements.txt
   ```
   or manually add it to the file with its version

## Troubleshooting

### Common Issues

1. **Service Won't Start**

   - Ensure you have activated the virtual environment
   - Verify that all dependencies are installed
   - Check if another process is using port 8002

2. **Connection Errors to Other Services**

   - Ensure NLP Service is running on the correct port
   - Ensure Document Service is running on the correct port
   - Check that the URLs in the `.env` file are correct

3. **Import Errors**
   - Make sure all packages are installed correctly
   - Try reinstalling the dependencies:
     ```bash
     pip install -r requirements.txt
     ```

### Getting Help

If you encounter issues not covered in this guide:

1. Check the logs for error messages
2. Consult the project documentation
3. Reach out to the development team for assistance
