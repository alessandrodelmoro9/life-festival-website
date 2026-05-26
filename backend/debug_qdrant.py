import os
from dotenv import load_dotenv
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore

def debug_qdrant():
    load_dotenv()
    url = os.getenv("QDRANT_URL")
    key = os.getenv("QDRANT_API_KEY")
    
    # print(f"Qdrant Client Version: {qdrant_client.__version__}")
    client = qdrant_client.QdrantClient(url=url, api_key=key)
    
    print(f"Client type: {type(client)}")
    print(f"Has search: {hasattr(client, 'search')}")
    # print(f"Available methods (first 20): {dir(client)[:20]}")
    
    # Try to see if 'search' is in dir(client)
    methods = dir(client)
    if 'search' in methods:
        print("✅ 'search' method found in client")
    else:
        print("❌ 'search' method NOT found in client")
        print(f"Available methods: {methods}")
    
    try:
        vs = QdrantVectorStore(client=client, collection_name="life_design_2026")
        print("VectorStore initialized with client")
        
        # Test a search
        print("Testing search...")
        # Since we don't have embeddings here easily without initializing more, 
        # let's just check if the client.search works directly with dummy vector
        # assuming the collection exists and has some vector size
        # Actually, let's just check if we can list collections to be sure
        collections = client.get_collections()
        print(f"Collections found: {collections}")
        
    except Exception as e:
        print(f"VectorStore/Search test failed: {e}")

if __name__ == "__main__":
    debug_qdrant()
