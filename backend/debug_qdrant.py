import os
from dotenv import load_dotenv
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore

def debug_qdrant():
    load_dotenv()
    url = os.getenv("QDRANT_URL")
    key = os.getenv("QDRANT_API_KEY")
    
    print(f"Qdrant Client Version: {qdrant_client.__version__}")
    client = qdrant_client.QdrantClient(url=url, api_key=key)
    
    print(f"Client type: {type(client)}")
    print(f"Has search: {hasattr(client, 'search')}")
    print(f"Available methods (first 20): {dir(client)[:20]}")
    
    try:
        vs = QdrantVectorStore(client=client, collection_name="test")
        print("VectorStore initialized with client")
    except Exception as e:
        print(f"VectorStore init failed: {e}")

if __name__ == "__main__":
    debug_qdrant()
