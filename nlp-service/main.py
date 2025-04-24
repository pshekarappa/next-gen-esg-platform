from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import requests
import os
from dotenv import load_dotenv
import openai
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define the document service URL
DOCUMENT_SERVICE_URL = os.getenv("DOCUMENT_SERVICE_URL", "http://localhost:8000")

# Create FastAPI app
app = FastAPI(title="NLP Service")

# Define request and response models
class QueryRequest(BaseModel):
    query: str
    n_results: Optional[int] = 5

class TextChunk(BaseModel):
    content: str
    source: str
    relevance_score: float

class QueryResponse(BaseModel):
    answer: str
    source_chunks: List[Dict[str, Any]]

@app.get("/")
def read_root():
    return {"message": "Welcome to NLP Service"}

@app.post("/process_query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        # 1. Validate the input
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
            
        # 2. Send the query to the Document Service
        document_response = requests.post(
            f"{DOCUMENT_SERVICE_URL}/search",
            json={"query": request.query, "n_results": 10}  # Retrieve more chunks
        )
        
        # Check if the request was successful
        if document_response.status_code != 200:
            raise HTTPException(
                status_code=document_response.status_code,
                detail=f"Document service error: {document_response.text}"
            )
            
        # 3. Get the relevant chunks from the Document Service
        try:
            chunks = document_response.json()
            print(f"Document service returned: {json.dumps(chunks, indent=2)}")
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from response: {document_response.text}")
            chunks = []

        # 4. Process the chunks to extract text content
        context = ""
        processed_chunks = []
        
        # Handle different possible response formats
        if isinstance(chunks, list):
            for chunk in chunks:
                try:
                    if isinstance(chunk, dict):
                        # Add the chunk to our processed list
                        processed_chunks.append(chunk)
                        
                        # Try to extract content - checking multiple possible field names
                        for field in ["content", "text", "chunk", "document", "data"]:
                            if field in chunk and chunk[field]:
                                if context:
                                    context += "\n\n"
                                context += str(chunk[field])
                                break
                except Exception as e:
                    print(f"Error processing chunk: {str(e)}")
        elif isinstance(chunks, dict):
            # The response might be a dict with results in a field
            processed_chunks = [chunks]  # Use the whole dict as a single chunk
            
            # Try to extract content from common field names
            for field in ["content", "text", "result", "data", "document"]:
                if field in chunks and chunks[field]:
                    context = str(chunks[field])
                    break
            
            # It might have a results/items array
            for field in ["results", "items", "chunks", "documents"]:
                if field in chunks and isinstance(chunks[field], list):
                    processed_chunks = chunks[field]
                    context = ""
                    for item in chunks[field]:
                        if isinstance(item, dict):
                            for content_field in ["content", "text", "chunk", "document", "data"]:
                                if content_field in item and item[content_field]:
                                    if context:
                                        context += "\n\n"
                                    context += str(item[content_field])
                                    break
                    break
        
        # If we couldn't extract any content, use a placeholder
        if not context:
            context = "No relevant content found for the query."
            print("Warning: Could not extract any content from the chunks")
            
        # 5. Use OpenAI to synthesize an answer
        # Create a more detailed system prompt
        system_prompt = """You are an ESG (Environmental, Social, and Governance) policy expert assistant.
Answer the user's question ONLY based on the provided context.
If the information is not in the context, say 'Based on the available information, I cannot provide a complete answer to this question.'
Format your response clearly with bullet points where appropriate.
For policy-related questions, clearly state the policy name and document source when available."""

        # Provide better context structure
        context_text = ""
        for i, chunk in enumerate(chunks):
            context_text += f"\n--- Document {i+1} ---\n"
            context_text += f"Source: {chunk.get('metadata', {}).get('file_name', 'Unknown')}\n"
            context_text += f"{chunk.get('text', '')}\n"

        # Use chain-of-thought prompting
        cot_prompt = f"""Context: {context}

Question: {request.query}

To answer this question accurately, I'll:
1. Identify the relevant ESG policies in the context
2. Extract the specific clauses or statements that address the question
3. Synthesize this information into a clear, comprehensive answer
4. Cite the specific policy documents

Reasoning through this step by step:"""

        # Ensure answers are grounded in the source text
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": cot_prompt}
        ]

        completion = client.chat.completions.create(
            model="gpt-4.1",
            messages=messages,
            temperature=0.2  # Lower temperature for more factual responses
        )
        
        answer = completion.choices[0].message.content
        
        # You can also add a verification step
        def verify_answer(answer, context):
            verification = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant. Your task is to verify if the answer is fully supported by the given context."},
                    {"role": "user", "content": f"Answer: {answer}\n\nContext: {context}\n\nIs the answer fully supported by the context? If not, explain why."}
                ]
            )
            return verification.choices[0].message.content
        
        # 6. Return the result
        return {
            "answer": answer,
            "source_chunks": processed_chunks if processed_chunks else [{"content": "No chunks found"}]
        }
        
    except requests.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Error communicating with Document Service: {str(e)}")
    except Exception as e:
        import traceback
        print(f"Error processing query: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

# Add semantic reranking of results before sending to OpenAI
def rerank_chunks(chunks, query):
    # Sort by relevance score if available
    if chunks and isinstance(chunks[0], dict) and "score" in chunks[0]:
        return sorted(chunks, key=lambda x: x.get("score", 0))
    return chunks

# Hybrid retrieval approach
def hybrid_search(query, n_results=5):
    # Get semantic search results
    semantic_results = requests.post(
        f"{DOCUMENT_SERVICE_URL}/search",
        json={"query": query, "n_results": n_results}
    ).json()
    
    # Get keyword search results (if you add this endpoint to Document Service)
    keyword_results = requests.post(
        f"{DOCUMENT_SERVICE_URL}/keyword_search",
        json={"query": query, "n_results": n_results}
    ).json()
    
    # Combine and deduplicate results
    all_results = semantic_results + keyword_results
    unique_results = {result.get("chunk_id"): result for result in all_results}
    
    return list(unique_results.values())

def preprocess_query(query):
    # Expand ESG acronyms
    replacements = {
        "ESG": "Environmental, Social, and Governance",
        "GHG": "Greenhouse Gas",
        "CSR": "Corporate Social Responsibility"
    }
    
    for acronym, expansion in replacements.items():
        if acronym in query:
            query = query.replace(acronym, f"{acronym} ({expansion})")
    
    # Add query expansion via OpenAI
    expansion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Generate 3 alternative phrasings of the user's ESG policy question to improve search results. Return only the questions separated by |"},
            {"role": "user", "content": query}
        ]
    ).choices[0].message.content
    
    return {"original": query, "expansions": expansion.split("|")}
