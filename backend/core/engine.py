import os
import re
import logging
from typing import List, Dict, Any, Optional
from llama_index.core import VectorStoreIndex, StorageContext, Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.openai_like import OpenAILike
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.memory import ChatMemoryBuffer
from qdrant_client import QdrantClient
from llama_index.core.postprocessor import SimilarityPostprocessor

logger = logging.getLogger(__name__)

class LifeRagEngine:
    def __init__(self):
        try:
            # 1. Configuration & Env Vars
            qdrant_url = os.getenv("QDRANT_URL")
            qdrant_api_key = os.getenv("QDRANT_API_KEY")
            openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
            collection = os.getenv("QDRANT_COLLECTION", "life_design_festival")
            
            # 2. Models Setup (Optimized for Gemini 2.0 Flash)
            self.embed_model = OpenAIEmbedding(
                model="text-embedding-3-small",
                api_key=openrouter_api_key,
                api_base="https://openrouter.ai/api/v1",
            )
            
            self.llm = OpenAILike(
                model="google/gemini-2.0-flash-001",
                api_key=openrouter_api_key,
                api_base="https://openrouter.ai/api/v1",
                is_chat_model=True,
                context_window=30000
            )
            
            Settings.llm = self.llm
            Settings.embed_model = self.embed_model

            # 3. Vector Store
            self.client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key, prefer_grpc=False)
            self.vector_store = QdrantVectorStore(client=self.client, collection_name=collection)
            self.index = VectorStoreIndex.from_vector_store(self.vector_store, embed_model=self.embed_model)

            # 4. Professional System Prompt (Entity Linking + Better Formatting)
            self.system_prompt = (
                "Sei l'AI Curator (chiamata 'Traccia') del LIFE Design Festival 2026. "
                "Guida l'utente tra speaker, workshop e logistica.\n\n"
                "REGOLE DI RISPOSTA:\n"
                "- Usa solo le informazioni nel CONTESTO.\n"
                "- **FORMATTAZIONE ORARI**: Per programmi o orari, NON usare tabelle. Usa ELENCHI PUNTATI PULITI (es: - 10:00 | Nome Speaker - Titolo).\n"
                "- Usa il GRASSETTO per i nomi propri.\n"
                "- **ENTITY LINKING (CRITICO)**: Ogni volta che nomini uno speaker, sponsor, workshop o attività, "
                "DEVI aggiungere alla fine della risposta il tag: [[REF:id]].\n"
                "Esempio: 'Samuela Vaccari curerà l'allestimento. [[REF:cromia-design]]'\n"
                "Usa solo gli ID esatti trovati nel campo 'id' dei metadati del contesto.\n"
                "- Per gli sponsor come BCC Basilicata, usa l'id [[REF:bcc]].\n"
                "- Per Cosmico, usa l'id [[REF:cosmico]] e cita Marco Zamberlan.\n"
                "- Se non trovi informazioni, scusati gentilmente e non inventare nulla.\n"
                "- Se un utente chiede 'Chi è [nome founder]', rispondi descrivendo il suo studio/realtà e includendo il tag REF dello studio.\n"
            )
            
            # 5. Founder to Entity Mapping
            self.founder_map = {
                "samuela vaccari": "cromia-design",
                "marco zamberlan": "cosmico",
                "pierfilippo ariano": "be-family",
                "andrea mastroluca": "auge-design",
                "marco oggian": "brutto-studio",
                "samuel canay": "brutto-studio",
                "loriana consentino": "the-wave-studio",
                "riccardo albertini": "rocketpanda-studio",
                "cosimo lorenzo pancini": "zetafonts",
                "dario manzo": "zetafonts",
                "marisa santopietro": "msd",
                "maurizio caggiano": "basic",
                "michele arleo": "adci"
            }
            
            self.chat_engines: Dict[str, Any] = {}
            self.postprocessor = SimilarityPostprocessor(similarity_cutoff=0.30)
            
            logger.info("✨ LifeRagEngine (Enterprise Edition v2) initialized successfully")
            
        except Exception as e:
            logger.error(f"Initialization Error: {e}")
            raise e

    def get_chat_engine(self, session_id: str):
        if session_id not in self.chat_engines:
            memory = ChatMemoryBuffer.from_defaults(token_limit=10000)
            self.chat_engines[session_id] = self.index.as_chat_engine(
                chat_mode="condense_plus_context",
                memory=memory,
                system_prompt=self.system_prompt,
                node_postprocessors=[self.postprocessor],
                similarity_top_k=40
            )
        return self.chat_engines[session_id]

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        greetings = ['ciao', 'buongiorno', 'hey', 'hello', 'hi']
        if message.lower().strip() in greetings:
            return {
                "text": "Ciao! Sono **Traccia**, l'AI Curator del LIFE Design Festival 2026. Come posso aiutarti?",
                "images": [], "links": [], "source": "system"
            }

        try:
            chat_engine = self.get_chat_engine(session_id)
            response = chat_engine.chat(message)
            response_text = str(response)
            
            # 1. Extraction of Entity Tags [[REF:id]]
            entity_tags = re.findall(r'\[\[REF:(.*?)\]\]', response_text)
            
            # 2. Cleanup of response text
            clean_text = re.sub(r'\[\[REF:.*?\]\]', '', response_text).strip()
            
            # Empty Response Fallback
            if not clean_text or clean_text.lower() == "empty response":
                 clean_text = "Mi scuso, ma non ho trovato informazioni specifiche su questo. Prova a chiedermi del programma o di uno speaker!"

            final_images = set()
            final_links = set()
            
            # 3. Precise Metadata Matching
            for tag_id in entity_tags:
                tag_id = tag_id.strip().lower()
                for node in response.source_nodes:
                    meta = node.node.metadata
                    if meta.get("id", "").lower() == tag_id:
                        if "img" in meta: final_images.add(meta["img"])
                        if "web" in meta: final_links.add(meta["web"])
                        break
            
            # 4. Fallback for Founder Names in message
            lower_msg = message.lower()
            for founder, entity_id in self.founder_map.items():
                if founder in lower_msg:
                    if entity_id not in [tag.lower().strip() for tag in entity_tags]:
                        for node in response.source_nodes:
                            meta = node.node.metadata
                            if meta.get("id", "").lower() == entity_id:
                                if "img" in meta: final_images.add(meta["img"])
                                if "web" in meta: final_links.add(meta["web"])

            return {
                "text": clean_text,
                "images": list(final_images),
                "links": list(final_links),
                "source": "openrouter-gemini-2.0"
            }

        except Exception as e:
            logger.error(f"Query Error: {e}")
            return {
                "text": "Errore tecnico. Riprova tra poco.",
                "images": [], "links": [], "source": "error"
            }

