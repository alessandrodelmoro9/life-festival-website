import os
import re
import logging
from typing import List, Dict, Any
from llama_index.core import VectorStoreIndex, StorageContext, PromptTemplate
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
            collection = os.getenv("QDRANT_COLLECTION", "life_design_festival")
            
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
                model_name="models/gemini-flash-latest", 
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

            # Define a strict QA template
            self.qa_prompt_tmpl = (
                "Sei l'AI Curator del LIFE Design Festival 2026. Il tuo compito è rispondere alle domande degli utenti "
                "basandoti ESCLUSIVAMENTE sul contesto fornito sotto. Se l'informazione non è nel contesto, non inventare "
                "e invita l'utente a scrivere a info@lifedesignfestival.it.\n"
                "REGOLE:\n"
                "- Sii preciso su nomi, orari e ruoli.\n"
                "- Se ti chiedono di una persona, verifica se è associata a uno studio o collettivo (es. Marco Oggian -> Brutto Studio).\n"
                "- Mantieni uno stile professionale, narrativo ma conciso.\n\n"
                "CONTESTO:\n"
                "{context_str}\n\n"
                "DOMANDA: {query_str}\n\n"
                "RISPOSTA:"
            )
            self.qa_prompt = PromptTemplate(self.qa_prompt_tmpl)
            
            logger.info("✨ LifeRagEngine initialized successfully")
            
        except Exception as e:
            logger.error(f"Initialization Error: {e}")
            raise e

    def query(self, message: str) -> Dict[str, Any]:
        # Greeting handler (bypass RAG)
        greetings = ['ciao', 'buongiorno', 'hey', 'hello', 'hi', 'salve']
        if message.lower().strip() in greetings:
            return {
                "text": "Ciao! Sono l'AI Curator del LIFE 2026. Come posso aiutarti oggi? Posso darti info su speaker, programma o sponsor del festival.",
                "images": [],
                "links": [],
                "source": "system"
            }

        try:
            # Create query engine with explicit prompts and higher top_k
            query_engine = self.index.as_query_engine(
                llm=self.primary_llm, 
                similarity_top_k=8,
                text_qa_template=self.qa_prompt
            )
            response = query_engine.query(message)
            source = "google-gemini-flash"
        except Exception as e:
            logger.error(f"Primary Query Error: {e}")
            if self.fallback_llm:
                try:
                    query_engine = self.index.as_query_engine(
                        llm=self.fallback_llm, 
                        similarity_top_k=8,
                        text_qa_template=self.qa_prompt
                    )
                    response = query_engine.query(message)
                    source = "openrouter-deepseek-free"
                except Exception as e2:
                    logger.error(f"Fallback Query Error: {e2}")
                    raise Exception(f"Errore critico: {str(e2)}")
            else:
                raise Exception(f"Errore di sistema: {str(e)}")

        images = []
        links = []
        
        # Process source nodes to extract media and links
        for node in response.source_nodes:
            content = node.node.get_content()
            # Extract images
            img_matches = re.findall(r'\/assets\/(?:speakers|logos|location)\/.*?\.(?:jpg|jpeg|png|svg|webp|JPG)', content)
            images.extend([img.strip() for img in img_matches])
            
            # Extract markdown links
            link_matches = re.findall(r'\[.*?\]\((https?:\/\/.*?)\)', content)
            links.extend(link_matches)

        return {
            "text": str(response),
            "images": list(set(images)),
            "links": list(set(links)),
            "source": source
        }
