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

            # 4. Professional System Prompt (Entity Linking + Better Formatting + Inclusivity)
            self.system_prompt = (
                "Sei l'AI Curator del LIFE Design Festival 2026. "
                "Il tuo compito è guidare l'utente tra speaker, workshop, partner e logistica del festival.\n\n"
                "REGOLE DI RISPOSTA:\n"
                "- **LINGUAGGIO INCLUSIVO**: Usa sempre la Schwa (ə) per i plurali misti o quando ti riferisci a persone in modo neutro (es: 'tuttə', 'creatə', 'colleghə').\n"
                "- **PROATTIVITÀ E COMPLETEZZA**: Chiudi SEMPRE con una domanda. Se parli di WORKSHOP, DEVI includere immediatamente il PREZZO e specificare che il biglietto è acquistabile online.\n"
                "- **ENTITY LINKING (MANDATORIO)**: Ogni volta che nomini uno speaker, sponsor, workshop o attività, DEVI aggiungere il tag: [[REF:id]].\n"
                "- **RECOLA PER GLI ELENCHI**: In liste lunghe o cronoprogrammi, DEVI inserire il tag [[REF:id]] per OGNI SINGOLA RIGA. È fondamentale per mostrare le immagini di tuttə lə speaker.\n"
                "  Esempio: '- 10:30 | Simone Checchia [[REF:simone-checchia]]'\n"
                "- **IMMAGINI COMPOSITE (BANNER)**: Quando l'utente chiede informazioni generali su TUTTI lə speaker, o lə speaker di una giornata/mattina/pomeriggio, oppure su TUTTI lə sponsor, DEVI aggiungere all'inizio della risposta il tag REF corrispondente alla gallery composita per non intasare la chat con troppe immagini singole.\n"
                "  - Tutti gli sponsor -> [[REF:sponsor-wall]]\n"
                "  - Speaker Venerdì Mattina -> [[REF:gallery-friday-morning]]\n"
                "  - Speaker Venerdì Pomeriggio -> [[REF:gallery-friday-afternoon]]\n"
                "  - Speaker Sabato Mattina -> [[REF:gallery-saturday-morning]]\n"
                "  - Speaker Sabato Pomeriggio -> [[REF:gallery-saturday-afternoon]]\n"
                "- Usa SOLO le informazioni fornite nel CONTESTO.\n"
                "- Se l'utente chiede qualcosa che NON riguarda il festival, "
                "rispondi gentilmente che non puoi aiutarlo perché devi restare focalizzato sul festival e aggiungi una battuta sul fatto che 'i token non sono gratis'.\n"
                "- **FORMATTAZIONE ORARI**: Usa ELENCHI PUNTATI PULITI (es: - 10:00 | Nome - Titolo).\n"
                "- Usa il GRASSETTO per i nomi propri.\n"
                "- Usa sempre e solo l'ID esatto trovato nel campo 'id' dei metadati del nodo di contesto corrispondente.\n"
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
                "cosimo pancini": "zetafonts",
                "dario manzo": "zetafonts",
                "francesco canovaro": "zetafonts",
                "debora manetti": "zetafonts",
                "marisa santopietro": "msd",
                "maurizio caggiano": "basic",
                "michele arleo": "adci",
                "valentina romeo": "etimologia",
                "luigi bruno": "jupiter",
                "francesco marri": "fm",
                "gianni andrulli": "ego55",
                "nicola petrillo": "ego55",
                "paolo persia": "ego55",
                "martina dipede": "ego55",
                "marco molteni": "jekyll-hyde",
                "margherita monguzzi": "jekyll-hyde",
                "camilla zampolini": "adoratorio-studio",
                "enea rossi": "adoratorio-studio",
                "anna d'andrea": "retro-gusto",
                "rocchina zaccagnino": "retro-gusto",
                "renata verrastro": "retro-gusto",
                "alfredo avena": "avena"
            }
            
            self.chat_engines: Dict[str, Any] = {}
            self.postprocessor = SimilarityPostprocessor(similarity_cutoff=0.35)
            
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
                similarity_top_k=25
            )
        return self.chat_engines[session_id]

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        greetings = ['ciao', 'buongiorno', 'hey', 'hello', 'hi']
        if message.lower().strip() in greetings:
            return {
                "text": "Ciao! Sono il **Curatore AI** del LIFE Design Festival 2026. Come posso aiutartiə?",
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
            
            # 3. Precise Metadata Matching (with strict type filtering)
            for tag_id in entity_tags:
                tag_id = tag_id.strip().lower()
                for node in response.source_nodes:
                    meta = node.node.metadata
                    if meta.get("id", "").lower() == tag_id:
                        if "img" in meta:
                            # Strict filtering: only show relevant types in carousel
                            if meta.get("type") in ["speaker", "composite", "sponsor"]:
                                final_images.add(meta["img"])
                        if "web" in meta: 
                            final_links.add(meta["web"])
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

if __name__ == "__main__":
    # Test local run
    import dotenv
    dotenv.load_dotenv()
    engine = LifeRagEngine()
    print(engine.query("Chi è Andrea Mastroluca?"))
