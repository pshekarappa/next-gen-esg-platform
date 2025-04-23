import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define the document service URL
DOCUMENT_SERVICE_URL = os.getenv("DOCUMENT_SERVICE_URL", "http://localhost:8000")

def test_search_endpoint():
    """Test the search endpoint of the Document Service"""
    try:
        # Send a test query to the Document Service
        response = requests.post(
            f"{DOCUMENT_SERVICE_URL}/search",
            json={"query": "What is ESG policy?", "n_results": 3}
        )
        
        # Print the status code
        print(f"Status code: {response.status_code}")
        
        # Check if the request was successful
        if response.status_code == 200:
            # Get the response data
            data = response.json()
            
            # Print the structure of the response
            print("Response structure:")
            print(json.dumps(data, indent=2))
            
            # Check if the response is a list
            if isinstance(data, list):
                print(f"Response is a list with {len(data)} items")
                
                # Print the structure of the first item if available
                if data and len(data) > 0:
                    print("First item structure:")
                    print(json.dumps(data[0], indent=2))
                    
                    # Check if the first item has a 'content' field
                    if isinstance(data[0], dict):
                        if "content" in data[0]:
                            print("The 'content' field is present in the first item")
                        else:
                            print("The 'content' field is NOT present in the first item")
                            print("Available fields:", list(data[0].keys()))
            else:
                print(f"Response is not a list, it's a {type(data)}")
                
                # If it's a dictionary, check if it has an items field
                if isinstance(data, dict):
                    if "items" in data:
                        print("Response has an 'items' field which might contain the chunks")
                    print("Available fields:", list(data.keys()))
        else:
            print(f"Request failed with content: {response.text}")
    
    except requests.RequestException as e:
        print(f"Error communicating with Document Service: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    test_search_endpoint() 