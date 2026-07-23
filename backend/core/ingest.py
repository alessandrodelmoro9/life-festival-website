import os
import logging
import json
import re
from typing import List, Any
from dotenv import load_dotenv
from llama_index.core import SimpleDirectoryReader, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import TextNode, BaseNode
from llama_index.embeddings.openai import OpenAIEmbedding

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "storage"))

def process_document_by_entities(documents: List[Any]) -> List[BaseNode]:
    """
    Splits documents into entities based on headers followed by METADATA blocks.
    Ensures that all text belonging to an entity inherits its metadata.
    Works for Speakers (##), Sponsors (###), and Activities.
    """
    all_nodes = []
    text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=100)
    
    entity_pattern = r'(#+ .*?)\n> \*\*METADATA\*\*: (\{.*?\})'
    
    for doc in documents:
        text = doc.text
        matches = list(re.finditer(entity_pattern, text))
        
        if not matches:
            chunks = text_splitter.split_text(text)
            for chunk in chunks:
                all_nodes.append(TextNode(text=chunk, metadata=doc.metadata))
            continue

        for i in range(len(matches)):
            start_match = matches[i]
            header = start_match.group(1)
            metadata_json = start_match.group(2)
            
            end_pos = matches[i+1].start() if i+1 < len(matches) else len(text)
            content_start = start_match.end()
            entity_content = text[content_start:end_pos].strip()
            
            full_entity_text = f"{header}\n{entity_content}"
            
            try:
                entity_metadata = json.loads(metadata_json)
            except Exception as e:
                logger.error(f"Error parsing metadata for {header}: {e}")
                entity_metadata = {}

            final_metadata = doc.metadata.copy()
            final_metadata.update(entity_metadata)
            
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
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

    embed_model = OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=openrouter_api_key,
        api_base="https://openrouter.ai/api/v1",
    )
    
    knowledge_path = os.path.join(os.path.dirname(__file__), "..", "knowledge")
    reader = SimpleDirectoryReader(input_dir=knowledge_path, required_exts=[".md"])
    documents = reader.load_data()
    
    nodes = process_document_by_entities(documents)
    logger.info(f"Building local VectorStoreIndex from {len(nodes)} nodes...")
    
    index = VectorStoreIndex(nodes, embed_model=embed_model)
    
    os.makedirs(STORAGE_DIR, exist_ok=True)
    index.storage_context.persist(persist_dir=STORAGE_DIR)
    
    logger.info(f"✨ Ingestion complete: Index persisted locally to '{STORAGE_DIR}'.")

if __name__ == "__main__":
    run_ingestion()
