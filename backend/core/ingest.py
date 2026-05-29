import os
import logging
import time
import json
import re
from typing import List, Dict, Any
from dotenv import load_dotenv
from llama_index.core import SimpleDirectoryReader, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import TextNode, BaseNode
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_document_by_entities(documents: List[Any]) -> List[BaseNode]:
    """
    Splits documents into entities based on headers followed by METADATA blocks.
    Ensures that all text belonging to an entity inherits its metadata.
    Works for Speakers (##), Sponsors (###), and Activities.
    """
    all_nodes = []
    text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=100)
    
    # Pattern to find headers followed by metadata
    # Group 1: Header (e.g., ## Name or ### Sponsor Name)
    # Group 2: Metadata JSON
    entity_pattern = r'(#+ .*?)\n> \*\*METADATA\*\*: (\{.*?\})'
    
    for doc in documents:
        text = doc.text
        
        # We find all entity starts
        matches = list(re.finditer(entity_pattern, text))
        
        if not matches:
            # Fallback for documents without explicit metadata blocks (intro sections)
            chunks = text_splitter.split_text(text)
            for chunk in chunks:
                all_nodes.append(TextNode(text=chunk, metadata=doc.metadata))
            continue

        # Process each entity block
        for i in range(len(matches)):
            start_match = matches[i]
            header = start_match.group(1)
            metadata_json = start_match.group(2)
            
            # Start of next entity or end of document
            end_pos = matches[i+1].start() if i+1 < len(matches) else len(text)
            
            # The content of this entity starts after the metadata line
            content_start = start_match.end()
            entity_content = text[content_start:end_pos].strip()
            
            # Combine header and content for better context in every chunk
            # This helps the vector search find the entity even in middle chunks
            full_entity_text = f"{header}\n{entity_content}"
            
            try:
                entity_metadata = json.loads(metadata_json)
            except Exception as e:
                logger.error(f"Error parsing metadata for {header}: {e}")
                entity_metadata = {}

            # Merge with document metadata (file_path, etc.)
            final_metadata = doc.metadata.copy()
            final_metadata.update(entity_metadata)
            
            # Split into chunks if necessary, but keep metadata consistent
            chunks = text_splitter.split_text(full_entity_text)
            for chunk in chunks:
                node = TextNode(
                    text=chunk,
                    metadata=final_metadata
                )
                all_nodes.append(node)
                
    return all_nodes

def run_ingestion():
    load_dotenv()
    
    # Configuration
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    collection_name = os.getenv("QDRANT_COLLECTION", "life_design_festival")

    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key, timeout=60)
    
    logger.info(f"Checking collection {collection_name}...")
    try:
        if client.collection_exists(collection_name):
            logger.info(f"Deleting existing collection {collection_name} for fresh atomic entity-based ingestion...")
            client.delete_collection(collection_name)
        
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
    except Exception as e:
        logger.error(f"Failed to setup collection: {e}")
        return

    embed_model = OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=openrouter_api_key,
        api_base="https://openrouter.ai/api/v1",
    )
    
    vector_store = QdrantVectorStore(client=client, collection_name=collection_name)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    knowledge_path = os.path.join(os.path.dirname(__file__), "..", "knowledge")
    reader = SimpleDirectoryReader(input_dir=knowledge_path, required_exts=[".md"])
    documents = reader.load_data()
    
    # NEW: Atomic Entity-based processing with full metadata inheritance
    nodes = process_document_by_entities(documents)
    
    logger.info(f"Uploading {len(nodes)} nodes with atomic metadata injection...")
    
    batch_size = 15
    index = None
    
    for i in range(0, len(nodes), batch_size):
        batch = nodes[i : i + batch_size]
        logger.info(f"Uploading batch {i//batch_size + 1}/{ (len(nodes)//batch_size) + 1 if len(nodes)%batch_size else len(nodes)//batch_size}...")
        
        if index is None:
            index = VectorStoreIndex(batch, storage_context=storage_context, embed_model=embed_model)
        else:
            index.insert_nodes(batch)
        
        time.sleep(1)
    
    logger.info("✨ Ingestion complete: Every node now carries its entity's metadata.")

if __name__ == "__main__":
    run_ingestion()
