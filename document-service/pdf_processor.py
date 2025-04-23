import fitz  # PyMuPDF
import os
import re
from typing import List, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Clean extracted text by removing extra whitespace and other artifacts."""
    # Replace multiple spaces, tabs, and newlines with a single space
    text = re.sub(r'\s+', ' ', text)
    # Remove any non-printable characters
    text = re.sub(r'[^\x20-\x7E\s]', '', text)
    return text.strip()

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    logger.info(f"Processing PDF: {pdf_path}")
    
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        full_text = ""

        # Process each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Extract text from the page
            page_text = page.get_text("text")
            full_text += page_text + "\n\n"
            
            # Advanced: extract text from images if needed
            # This would require OCR which is more complex
            # If needed, we can add pytesseract or other OCR tools
        
        # Clean the extracted text
        cleaned_text = clean_text(full_text)
        logger.info(f"Successfully extracted text from {pdf_path}")
        return cleaned_text
    
    except Exception as e:
        logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
        raise Exception(f"Failed to process PDF: {str(e)}")

def extract_metadata_from_pdf(pdf_path: str) -> Dict[str, Any]:
    """Extract metadata from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        metadata = doc.metadata
        return {
            "title": metadata.get("title", ""),
            "author": metadata.get("author", ""),
            "subject": metadata.get("subject", ""),
            "keywords": metadata.get("keywords", ""),
            "page_count": len(doc),
            "file_name": os.path.basename(pdf_path)
        }
    except Exception as e:
        logger.error(f"Error extracting metadata from {pdf_path}: {str(e)}")
        return {"file_name": os.path.basename(pdf_path)}

def chunk_text(text, chunk_size=1000, chunk_overlap=200):
    # Improve chunking to respect paragraph boundaries
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) <= chunk_size:
            current_chunk += para + "\n\n"
        else:
            # Store the current chunk
            if current_chunk:
                chunks.append(current_chunk.strip())
            
            # Start a new chunk, including overlap
            words = current_chunk.split()
            overlap_text = ' '.join(words[-30:]) if len(words) > 30 else ''
            current_chunk = overlap_text + "\n\n" + para + "\n\n"
    
    # Add the final chunk
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks
