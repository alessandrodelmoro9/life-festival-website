import os
import re
import logging
from typing import List, Dict, Any
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.gemini import Gemini
from llama_index.llms.openrouter import OpenRouter
from llama_index.embeddings.google import GeminiEmbedding
from qdrant_client import QdrantClient

logger = logging.getLogger(__name__)

class LifeRagEngine:
    def __init__(self):
        try:
            url = os.getenv("QDRANT_URL")
            api_key = os.getenv("QDRANT_API_KEY")
            collection = os.getenv("QDRANT_COLLECTION", "life_design_2026")
            
            # Explicit client with compatible version (1.10.1)
            self.client = QdrantClient(
                url=url,
                api_key=api_key,
                prefer_grpc=False
            )
            
            self.vector_store = QdrantVectorStore(
                client=self.client,
                collection_name=collection
            )
            
            self.embed_model = GeminiEmbedding(
                model_name="models/gemini-embedding-001", 
                api_key=os.getenv("GOOGLE_API_KEY")
            )
            
            self.primary_llm = Gemini(
                model_name="models/gemini-2.0-flash", 
                api_key=os.getenv("GOOGLE_API_KEY")
            )
            
            if os.getenv("OPENROUTER_API_KEY"):
                self.fallback_llm = OpenRouter(
                    model="deepseek/deepseek-v4-flash:free",
                    api_key=os.getenv("OPENROUTER_API_KEY")
                )
            else:
                self.fallback_llm = None

            self.index = VectorStoreIndex.from_vector_store(
                self.vector_store, 
                embed_model=self.embed_model
            )
            
            self.system_prompt = """
            Sei l'AI Curator ufficiale del LIFE Design Festival 2026.
            STILE: Narrativo, fluido, colto ma accogliente. Rispondi in paragrafi.
            REGOLE: Usa solo le info fornite. Se non sai, invita a scrivere a info@lifedesignfestival.it.
            """
            logger.info("✨ LifeRagEngine initialized successfully")
            
        except Exception as e:
            logger.error(f"Initialization Error: {e}")
            raise e

    def query(self, message: str) -> Dict[str, Any]:
        query_text = f"{self.system_prompt}\n\nDomanda Utente: {message}"
        
        try:
            query_engine = self.index.as_query_engine(
                llm=self.primary_llm, 
                similarity_top_k=3
            )
            response = query_engine.query(query_text)
            source = "google-gemini-2.0"
        except Exception as e:
            logger.error(f"Query Error: {e}")
            if self.fallback_llm:
                query_engine = self.index.as_query_engine(
                    llm=self.fallback_llm, 
                    similarity_top_k=3
                )
                response = query_engine.query(query_text)
                source = "openrouter-deepseek-free"
            else:
                raise Exception(f"Errore di sistema: {str(e)}")

        images = []
        links = []
        
        for node in response.source_nodes:
            content = node.node.get_content()
            img_matches = re.findall(r'\/assets\/(?:speakers|logos)\/.*?\.(?:jpg|jpeg|png|svg|webp|JPG)', content)
            images.extend([img.strip() for img in img_matches])
            
            link_matches = re.findall(r'\[.*?\]\((https?:\/\/.*?)\)', content)
            links.extend(link_matches)

        return {
            "text": str(response),
            "images": list(set(images)),
            "links": list(set(links)),
            "source": source
        }
