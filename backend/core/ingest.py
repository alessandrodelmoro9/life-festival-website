import json
import logging
import re
from typing import Any, List
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode, TextNode
from llama_index.embeddings.openai import OpenAIEmbedding

from core.config import KNOWLEDGE_DIR, STORAGE_DIR, settings

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


def run_ingestion() -> None:
    embed_model = OpenAIEmbedding(
        model=settings.EMBED_MODEL_NAME,
        api_key=settings.OPENROUTER_API_KEY,
        api_base=settings.OPENROUTER_BASE_URL,
    )

    reader = SimpleDirectoryReader(input_dir=str(KNOWLEDGE_DIR), required_exts=[".md"])
    documents = reader.load_data()

    nodes = process_document_by_entities(documents)
    logger.info("Building local VectorStoreIndex from %d nodes...", len(nodes))

    index = VectorStoreIndex(nodes, embed_model=embed_model)

    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    index.storage_context.persist(persist_dir=str(STORAGE_DIR))

    logger.info("Ingestion complete: Index persisted locally to '%s'.", STORAGE_DIR)


if __name__ == "__main__":
    run_ingestion()
