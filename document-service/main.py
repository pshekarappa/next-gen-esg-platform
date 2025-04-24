from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from typing import List, Dict, Any, Optional
import json
import glob
import logging
from pydantic import BaseModel
import re
from datetime import datetime

# Import our modules
from pdf_processor import extract_text_from_pdf, extract_metadata_from_pdf, chunk_text
from embedding_store import EmbeddingStore

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="ESG Document Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
UPLOAD_DIR = "pdfs"
# IMPORTANT: Adjust these values to control token usage when integrating with OpenAI APIs
# If you encounter 'context_length_exceeded' errors in NLP service, reduce these values
CHUNK_SIZE = 350  # characters (reduced from 500 to avoid token limit issues)
CHUNK_OVERLAP = 100  # characters (reduced from 200)

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize embedding store
embedding_store = EmbeddingStore()

# Global storage for processing status
processing_status = {}

# Pydantic models for request/response
class SetupRequest(BaseModel):
    pdf_directory: Optional[str] = "pdfs"

class SearchRequest(BaseModel):
    query: str
    # Reducing default results to help avoid token limit issues with OpenAI
    n_results: Optional[int] = 3

class ProcessingStatusResponse(BaseModel):
    job_id: str
    status: str
    processed_count: int
    total_count: int
    failed_files: List[str]

@app.get("/")
def read_root():
    return {"status": "Document Service is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def process_pdfs_task(job_id: str, pdf_directory: str):
    """Background task to process all PDFs in a directory."""
    try:
        # Find all PDF files in the directory
        pdf_files = glob.glob(f"{pdf_directory}/*.pdf")
        
        # Initialize status
        processing_status[job_id] = {
            "status": "processing",
            "processed_count": 0,
            "total_count": len(pdf_files),
            "failed_files": []
        }
        
        # Process each PDF
        for pdf_path in pdf_files:
            try:
                # Extract text and metadata
                text = extract_text_from_pdf(pdf_path)
                metadata = extract_metadata_from_pdf(pdf_path)
                
                # Generate a document ID
                doc_id = str(uuid.uuid4())
                
                # Chunk the text
                chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
                
                # Store in embedding database
                embedding_store.add_document_chunks(doc_id, chunks, metadata)
                
                # Update status
                processing_status[job_id]["processed_count"] += 1
                
            except Exception as e:
                logger.error(f"Error processing {pdf_path}: {str(e)}")
                processing_status[job_id]["failed_files"].append(os.path.basename(pdf_path))
        
        # Update final status
        processing_status[job_id]["status"] = "completed"
        
    except Exception as e:
        logger.error(f"Error in background processing task: {str(e)}")
        processing_status[job_id]["status"] = "failed"

@app.post("/setup", response_model=dict)
async def setup_document_service(
    background_tasks: BackgroundTasks,
    request: SetupRequest
):
    """
    Set up the document service by processing all PDFs in the specified directory.
    Returns a job ID that can be used to check the processing status.
    """
    pdf_directory = request.pdf_directory
    
    # Check if directory exists
    if not os.path.exists(pdf_directory):
        raise HTTPException(status_code=404, detail=f"Directory {pdf_directory} not found")
    
    # Generate a job ID
    job_id = str(uuid.uuid4())
    
    # Start processing in the background
    background_tasks.add_task(process_pdfs_task, job_id, pdf_directory)
    
    return {
        "job_id": job_id,
        "message": "PDF processing started",
        "status_endpoint": f"/status/{job_id}"
    }

@app.get("/status/{job_id}", response_model=ProcessingStatusResponse)
async def get_processing_status(job_id: str):
    """Get the status of a PDF processing job."""
    if job_id not in processing_status:
        raise HTTPException(status_code=404, detail=f"Job ID {job_id} not found")
    
    status_data = processing_status[job_id]
    return {
        "job_id": job_id,
        **status_data
    }

@app.post("/search", response_model=List[Dict[str, Any]])
async def search_documents(request: SearchRequest):
    """
    Search for documents relevant to the query.
    Returns a list of document chunks ordered by relevance.
    """
    query = request.query
    n_results = request.n_results
    
    # Search for relevant documents
    results = embedding_store.search_documents(query, n_results)
    
    return results

@app.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    """Upload a single PDF file."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        # Process the file
        text = extract_text_from_pdf(file_path)
        metadata = extract_metadata_from_pdf(file_path)
        doc_id = str(uuid.uuid4())
        chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        embedding_store.add_document_chunks(doc_id, chunks, metadata)
        
        return {
            "message": f"File {file.filename} uploaded and processed successfully",
            "doc_id": doc_id,
            "chunk_count": len(chunks)
        }
    except Exception as e:
        logger.error(f"Error processing uploaded file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

def process_document(file_path):
    try:
        # Extract text from PDF with better error handling
        text = extract_text_from_pdf(file_path)
        
        # Extract metadata from the document
        metadata = extract_metadata(text)
        
        # Create chunks with policy-specific considerations
        chunks = create_policy_chunks(text)
        
        # Generate embeddings for each chunk
        embeddings = []
        for chunk in chunks:
            embedding = generate_embedding(chunk["text"])
            embeddings.append({
                "text": chunk["text"],
                "embedding": embedding,
                "metadata": {
                    **metadata,
                    "chunk_type": chunk["type"],
                    "page_number": chunk["page"],
                    "section_title": chunk.get("section_title", "")
                }
            })
        
        return {
            "success": True,
            "embeddings": embeddings,
            "metadata": metadata,
            "total_chunks": len(chunks)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def extract_metadata(text):
    # Extract key metadata from policy documents
    metadata = {
        "document_type": "policy",
        "extracted_date": datetime.now().isoformat()
    }
    
    # Try to extract policy title
    title_match = re.search(r'^(.*?)\n', text)
    if title_match:
        metadata["title"] = title_match.group(1).strip()
    
    # Try to extract policy date
    date_patterns = [
        r'Date:\s*(\d{1,2}/\d{1,2}/\d{4})',
        r'Effective\s*Date:\s*(\d{1,2}/\d{1,2}/\d{4})',
        r'(\d{1,2}\s+[A-Za-z]+\s+\d{4})'
    ]
    for pattern in date_patterns:
        date_match = re.search(pattern, text)
        if date_match:
            metadata["date"] = date_match.group(1)
            break
    
    return metadata

def create_policy_chunks(text):
    # Split text into pages
    pages = text.split('\f')
    chunks = []
    
    for page_num, page in enumerate(pages, 1):
        # Split page into sections based on headings
        sections = re.split(r'\n(?=[A-Z][a-z]+(?: [A-Z][a-z]+)*\s*\n)', page)
        
        current_section = None
        current_text = []
        
        for section in sections:
            # Check if this is a heading
            if re.match(r'^[A-Z][a-z]+(?: [A-Z][a-z]+)*\s*$', section.strip()):
                if current_section and current_text:
                    # Create chunk for previous section
                    chunk_text = ' '.join(current_text)
                    if len(chunk_text) > 100:  # Minimum chunk size
                        chunks.append({
                            "text": chunk_text,
                            "type": "section",
                            "page": page_num,
                            "section_title": current_section
                        })
                
                current_section = section.strip()
                current_text = []
            else:
                current_text.append(section)
        
        # Handle remaining text
        if current_text:
            chunk_text = ' '.join(current_text)
            if len(chunk_text) > 100:
                chunks.append({
                    "text": chunk_text,
                    "type": "section" if current_section else "content",
                    "page": page_num,
                    "section_title": current_section
                })
    
    return chunks

# Run with: uvicorn main:app --reload
