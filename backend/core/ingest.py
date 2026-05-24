import os
import logging
import time
from dotenv import load_dotenv
from llama_index.core import SimpleDirectoryReader, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import MarkdownNodeParser
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.google import GeminiEmbedding
from qdrant_client import QdrantClient

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_ingestion():
    load_dotenv()
    
    required_vars = ["GOOGLE_API_KEY", "QDRANT_URL", "QDRANT_API_KEY"]
    for var in required_vars:
        if not os.getenv(var):
            logger.error(f"Missing environment variable: {var}")
            return

    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY"),
    )
    
    vector_store = QdrantVectorStore(
        client=client, 
        collection_name=os.getenv("QDRANT_COLLECTION", "life_design_2026")
    )
    
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    embed_model = GeminiEmbedding(
        model_name="models/gemini-embedding-001", 
        api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    knowledge_path = os.path.join(os.path.dirname(__file__), "..", "knowledge")
    
    logger.info(f"Reading knowledge base from {knowledge_path}...")
    reader = SimpleDirectoryReader(input_dir=knowledge_path, required_exts=[".md"])
    documents = reader.load_data()
    
    logger.info("Parsing documents...")
    parser = MarkdownNodeParser()
    nodes = parser.get_nodes_from_documents(documents)
    
    logger.info(f"Starting controlled upload of {len(nodes)} nodes to Qdrant Cloud...")
    
    # Process nodes in small chunks with manual sleep to beat the 429 error
    batch_size = 20
    index = None
    
    for i in range(0, len(nodes), batch_size):
        batch = nodes[i : i + batch_size]
        logger.info(f"Processing batch {i//batch_size + 1}... ({i} to {min(i+batch_size, len(nodes))})")
        
        if index is None:
            index = VectorStoreIndex(batch, storage_context=storage_context, embed_model=embed_model)
        else:
            index.insert_nodes(batch)
            
        if i + batch_size < len(nodes):
            logger.info("Sleeping 20 seconds to respect Google API quotas...")
            time.sleep(20)
    
    logger.info("✨ Ingestion complete! Knowledge base is now live on Qdrant Cloud.")

if __name__ == "__main__":
    run_ingestion()
