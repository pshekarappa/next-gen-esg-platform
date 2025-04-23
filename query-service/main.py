from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import requests
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Service URLs
NLP_SERVICE_URL = os.getenv("NLP_SERVICE_URL", "http://localhost:8001")
DOCUMENT_SERVICE_URL = os.getenv("DOCUMENT_SERVICE_URL", "http://localhost:8000")

# Initialize FastAPI app
app = FastAPI(title="ESG Query Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    n_results: Optional[int] = 5
    include_metadata: Optional[bool] = True

class QueryResponse(BaseModel):
    answer: str
    source_chunks: List[Dict[str, Any]]
    query_metadata: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {"message": "ESG Query Service is running"}

@app.get("/health")
def health_check():
    # Check if all required services are available
    services_status = {}
    
    try:
        nlp_health = requests.get(f"{NLP_SERVICE_URL}/health", timeout=5)
        services_status["nlp_service"] = "up" if nlp_health.status_code == 200 else "down"
    except:
        services_status["nlp_service"] = "down"
        
    try:
        doc_health = requests.get(f"{DOCUMENT_SERVICE_URL}/health", timeout=5)
        services_status["document_service"] = "up" if doc_health.status_code == 200 else "down"
    except:
        services_status["document_service"] = "down"
    
    all_healthy = all(status == "up" for status in services_status.values())
    
    return {
        "status": "healthy" if all_healthy else "unhealthy",
        "services": services_status
    }

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a user query by orchestrating the flow between NLP and Document services
    """
    try:
        # 1. Send query to NLP service
        nlp_response = requests.post(
            f"{NLP_SERVICE_URL}/process_query",
            json={"query": request.query, "n_results": request.n_results}
        )
        
        if nlp_response.status_code != 200:
            raise HTTPException(
                status_code=nlp_response.status_code,
                detail=f"NLP service error: {nlp_response.text}"
            )
        
        nlp_data = nlp_response.json()
        
        # 2. Enrich response with metadata
        query_metadata = {
            "query_type": "policy_search",
            "processed_time": "now",  # In production, add actual timestamp
            "confidence_score": 0.85  # In production, get from NLP service
        }
        
        return {
            "answer": nlp_data["answer"],
            "source_chunks": nlp_data["source_chunks"],
            "query_metadata": query_metadata if request.include_metadata else None
        }
        
    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Service communication error: {str(e)}")
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True) 