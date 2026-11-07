import logging
import threading
from typing import Any, Dict, Optional

from cachetools import TTLCache
from llama_index.core import Settings, StorageContext, load_index_from_storage
from llama_index.core.chat_engine import ContextChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai_like import OpenAILike
from llama_index.retrievers.bm25 import BM25Retriever

from core.config import STORAGE_DIR, settings
from core.edition import Edition, load_edition
from core.ingest import is_storage_current, run_ingestion
from core.intents import is_greeting
from core.registry import load_entity_catalog, load_static_links
from core.resolver import (
    collect_active_ids,
    plan_query,
    read_source_nodes,
    resolve_images,
    resolve_links,
    strip_ref_tags,
)

logger = logging.getLogger(__name__)


class LifeRagEngine:
    def __init__(self, edition: Optional[Edition] = None):
        self.edition = edition or load_edition()
        self.static_links = load_static_links()
        self.catalog = load_entity_catalog()

        self.embed_model = OpenAIEmbedding(
            model=settings.EMBED_MODEL_NAME,
            api_key=settings.OPENROUTER_API_KEY,
            api_base=settings.OPENROUTER_BASE_URL,
        )
        self.llm = OpenAILike(
            model=settings.MODEL_NAME,
            api_key=settings.OPENROUTER_API_KEY,
            api_base=settings.OPENROUTER_BASE_URL,
            is_chat_model=True,
            context_window=30000,
            temperature=0.1,
        )
        Settings.llm = self.llm
        Settings.embed_model = self.embed_model

        if not is_storage_current():
            logger.warning(
                "Storage manifest mismatch or missing. Re-ingesting knowledge base..."
            )
            run_ingestion()
        else:
            logger.info("Storage manifest OK; loading existing index.")

        storage_context = StorageContext.from_defaults(persist_dir=str(STORAGE_DIR))
        self.index = load_index_from_storage(
            storage_context, embed_model=self.embed_model
        )
        self.nodes = list(self.index.docstore.docs.values())

        self.postprocessor = SimilarityPostprocessor(similarity_cutoff=0.0)
        self._retrievers: Dict[int, QueryFusionRetriever] = {}
        self._memories: TTLCache = TTLCache(
            maxsize=settings.MAX_SESSIONS, ttl=settings.SESSION_TTL_SECONDS
        )
        self._lock = threading.Lock()
        logger.info(
            "Engine synchronized locally with %d identifiers and %d nodes.",
            len(self.static_links),
            len(self.nodes),
        )

    def _get_retriever(self, top_k: int) -> QueryFusionRetriever:
        if top_k not in self._retrievers:
            vector_retriever = self.index.as_retriever(similarity_top_k=top_k)
            bm25_retriever = BM25Retriever.from_defaults(
                nodes=self.nodes, similarity_top_k=top_k
            )
            self._retrievers[top_k] = QueryFusionRetriever(
                retrievers=[vector_retriever, bm25_retriever],
                similarity_top_k=top_k,
                num_queries=1,
                mode="reciprocal_rerank",
                use_async=False,
            )
        return self._retrievers[top_k]

    def get_chat_engine(self, session_id: str, top_k: int = 20) -> ContextChatEngine:
        with self._lock:
            memory = self._memories.get(session_id)
            if memory is None:
                memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
                self._memories[session_id] = memory
            retriever = self._get_retriever(top_k)
        return ContextChatEngine.from_defaults(
            retriever=retriever,
            memory=memory,
            system_prompt=self.edition.system_prompt,
            node_postprocessors=[self.postprocessor],
            llm=self.llm,
        )

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        if is_greeting(message):
            return {
                "text": self.edition.greeting,
                "images": [],
                "links": [],
                "source": "system",
            }

        try:
            plan = plan_query(message, self.edition, self.catalog)
            chat_engine = self.get_chat_engine(session_id, top_k=plan.top_k)
            response = chat_engine.chat(plan.enhanced_message)
            response_text = str(response) if response else self.edition.fallback_text

            node_map, registry_links = read_source_nodes(
                getattr(response, "source_nodes", None), self.edition
            )
            active_ids = collect_active_ids(
                message, response_text, plan, node_map, self.static_links, self.edition
            )
            links = resolve_links(
                response_text, plan, active_ids, node_map, registry_links, self.static_links, self.edition
            )
            images = resolve_images(plan, active_ids, node_map, self.edition)

            return {
                "text": strip_ref_tags(response_text),
                "images": images,
                "links": links,
                "source": settings.MODEL_NAME,
            }

        except Exception as exc:
            logger.error("Query Execution Error: %s", exc)
            return {
                "text": self.edition.error_text,
                "images": [],
                "links": list(self.edition.error_links),
                "source": "error",
            }
