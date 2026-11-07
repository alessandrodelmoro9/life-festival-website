import hashlib
import json
import logging
import re
from typing import Any, Dict, List

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode, TextNode
from llama_index.embeddings.openai import OpenAIEmbedding

from core.config import KNOWLEDGE_DIR, STORAGE_DIR, settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CHUNK_SIZE = 1024
CHUNK_OVERLAP = 100
MANIFEST_FILE = STORAGE_DIR / "manifest.json"


def compute_manifest() -> Dict[str, Any]:
    files = {
        p.name: hashlib.sha256(p.read_bytes()).hexdigest()
        for p in sorted(KNOWLEDGE_DIR.glob("*.md"))
    }
    return {
        "embed_model": settings.EMBED_MODEL_NAME,
        "chunk_size": CHUNK_SIZE,
        "chunk_overlap": CHUNK_OVERLAP,
        "files": files,
    }


def is_storage_current() -> bool:
    if not (STORAGE_DIR / "docstore.json").exists() or not MANIFEST_FILE.exists():
        return False
    try:
        stored = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    except Exception:
        return False
    return stored == compute_manifest()


def process_document_by_entities(documents: List[Any]) -> List[BaseNode]:
    """
    Splits documents into entities based on headers followed by METADATA blocks.
    Ensures that all text belonging to an entity inherits its metadata.
    Works for Speakers (##), Sponsors (###), and Activities.
    """
    all_nodes = []
    text_splitter = SentenceSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    entity_pattern = r"(#+ .*?)\n> \*\*METADATA\*\*: (\{.*?\})"

    for doc in documents:
        text = doc.text
        matches = list(re.finditer(entity_pattern, text))

        if not matches:
            for chunk in text_splitter.split_text(text):
                all_nodes.append(TextNode(text=chunk, metadata=doc.metadata))
            continue

        for i, start_match in enumerate(matches):
            header = start_match.group(1)
            metadata_json = start_match.group(2)

            end_pos = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            entity_content = text[start_match.end() : end_pos].strip()
            full_entity_text = f"{header}\n{entity_content}"

            try:
                entity_metadata = json.loads(metadata_json)
            except Exception as e:
                logger.error("Error parsing metadata for %s: %s", header, e)
                entity_metadata = {}

            final_metadata = doc.metadata.copy()
            final_metadata.update(entity_metadata)

            for chunk in text_splitter.split_text(full_entity_text):
                all_nodes.append(TextNode(text=chunk, metadata=final_metadata))

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
    MANIFEST_FILE.write_text(
        json.dumps(compute_manifest(), indent=2) + "\n", encoding="utf-8"
    )

    logger.info("Ingestion complete: Index persisted locally to '%s'.", STORAGE_DIR)


if __name__ == "__main__":
    run_ingestion()
