import httpx
from sentence_transformers import SentenceTransformer
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NLPProcessor:
    def __init__(self, document_service_url, model_name="all-MiniLM-L6-v2"):
        """
        Initialize the NLP processor with the document service URL and the sentence transformer model.
        
        Args:
            document_service_url (str): URL of the Document Service
            model_name (str): Name of the sentence-transformers model to use
        """
        self.document_service_url = document_service_url
        logger.info(f"Loading sentence-transformers model: {model_name}")
        
        # Load the sentence transformer model - this will download the model on first run
        # all-MiniLM-L6-v2 is a good balance of speed and accuracy for beginners
        self.model = SentenceTransformer(model_name)
        logger.info("Model loaded successfully")
        
        # Initialize HTTP client for async requests
        self.http_client = httpx.AsyncClient(timeout=30.0)  # 30 second timeout
    
    async def generate_embedding(self, text):
        """
        Generate an embedding vector for the input text.
        
        Args:
            text (str): The input text
            
        Returns:
            list: The embedding vector as a list of floats
        """
        try:
            # Pre-process the query for better results
            processed_text = text.lower().strip()
            # Use MPNet instead of MiniLM for better accuracy (though slightly slower)
            self.model = SentenceTransformer('all-mpnet-base-v2')
            embedding = self.model.encode(processed_text)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
    
    async def search_documents(self, query):
        """
        Send the query to the Document Service to search for relevant chunks.
        
        Args:
            query (str): The user's original query text
            
        Returns:
            list: Relevant text chunks from the Document Service
        """
        try:
            # Endpoint at the Document Service
            search_url = f"{self.document_service_url}/search"
            
            # Prepare the request data according to SearchRequest schema from Document Service
            data = {
                "query": query,  # Use the original query text
                "n_results": 10  # Get more results for better filtering
            }
            
            # Send POST request to the Document Service
            logger.info(f"Sending search request to Document Service at {search_url}")
            response = await self.http_client.post(search_url, json=data)
            
            # Check if the request was successful
            if response.status_code == 200:
                results = response.json()
                logger.info(f"Received {len(results)} results from Document Service")
                return results
            else:
                logger.error(f"Document Service returned error: {response.status_code}, {response.text}")
                return []
        except Exception as e:
            logger.error(f"Error communicating with Document Service: {str(e)}")
            return []
    
    async def synthesize_answer(self, query, chunks):
        """
        Simple function to synthesize an answer from the retrieved chunks.
        
        Args:
            query (str): The original query
            chunks (list): The retrieved text chunks
            
        Returns:
            str: A synthesized answer
        """
        # Handle empty results
        if not chunks:
            return "I couldn't find relevant information for your query."
        
        # Log what we received
        logger.info(f"Synthesizing answer from {len(chunks)} chunks")
        
        # Create a coherent answer
        answer = "Based on our ESG policies:\n\n"
        
        # Process each chunk and extract text safely
        for i, chunk in enumerate(chunks[:3], 1):  # Limit to top 3 chunks
            try:
                # Handle different possible chunk formats
                if isinstance(chunk, dict):
                    # Try to get text from different possible keys
                    text = chunk.get('text', chunk.get('content', chunk.get('chunk', '')))
                    
                    # Try to get metadata if available
                    metadata = chunk.get('metadata', {})
                    if isinstance(metadata, dict):
                        source = metadata.get('filename', metadata.get('title', 'Policy document'))
                    else:
                        source = 'Policy document'
                else:
                    # If chunk is not a dict, convert to string
                    text = str(chunk)
                    source = 'Policy document'
                
                # Add to answer if we have text
                if text:
                    answer += f"• {text.strip()} (Source: {source})\n\n"
            except Exception as e:
                logger.error(f"Error processing chunk {i}: {str(e)}")
                continue
        
        # If we couldn't extract any text from chunks
        if answer == "Based on our ESG policies:\n\n":
            return "I found some information but couldn't process it correctly."
        
        return answer
    
    async def process_query(self, query):
        """
        Process a user query:
        1. Expand query with related ESG terms
        2. Send the expanded query to the Document Service
        3. Filter and rank the results by relevance
        4. Synthesize an answer from the most relevant chunks
        
        Args:
            query (str): The user's query text
            
        Returns:
            tuple: (list of relevant chunks, synthesized answer string)
        """
        try:
            logger.info(f"Processing query: {query}")
            
            # 1. Expand query with related ESG terms
            esg_terms = {
                "carbon": ["emissions", "footprint", "greenhouse gas", "GHG"],
                "sustainability": ["sustainable", "environmental impact"],
                "diversity": ["inclusion", "equity", "DEI"]
            }
            
            expanded_query = query
            for term, related in esg_terms.items():
                if term in query.lower():
                    expanded_query = f"{query} {' '.join(related)}"
            
            logger.info(f"Expanded query: {expanded_query}")
            
            # 2. Search for documents using the expanded query
            chunks = await self.search_documents(expanded_query)
            
            # Check if we got any results
            if not chunks:
                logger.warning("No results returned from document service")
                return [], "I couldn't find relevant information for your query."
            
            # 3. Post-filter chunks for relevance if we have any
            if self.is_relevant:  # Check if the method exists
                try:
                    filtered_chunks = [c for c in chunks if self.is_relevant(query, c.get('text', ''))]
                    if not filtered_chunks and chunks:  # If filtering removed all results but we had some
                        logger.info("All chunks filtered out. Using original chunks.")
                        filtered_chunks = chunks  # Use original chunks instead of returning nothing
                except Exception as e:
                    logger.error(f"Error in relevance filtering: {str(e)}")
                    filtered_chunks = chunks  # Use original chunks if filtering fails
            else:
                filtered_chunks = chunks
            
            # 4. Synthesize answer from the filtered chunks
            synthesized_answer = await self.synthesize_answer(query, filtered_chunks)
            
            return filtered_chunks[:5], synthesized_answer
        except Exception as e:
            logger.error(f"Error in query processing pipeline: {str(e)}")
            # Return a meaningful error message
            return [], f"Error processing your query: {str(e)}"

    def is_relevant(self, query, text):
        # Simple relevance check using keyword overlap
        query_words = set(query.lower().split())
        text_words = set(text.lower().split())
        overlap = len(query_words.intersection(text_words))
        return overlap >= 1  # At least one keyword must match 