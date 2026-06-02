import re
import logging
from typing import List, Dict, Any, Optional
from llama_index.core import VectorStoreIndex, Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.openai_like import OpenAILike
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.memory import ChatMemoryBuffer
from qdrant_client import QdrantClient
from llama_index.core.postprocessor import SimilarityPostprocessor

from core.config import settings, SYSTEM_PROMPT, ASSET_REGISTRY, FOUNDER_MAP

logger = logging.getLogger(__name__)

class LifeRagEngine:
    def __init__(self):
        try:
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
                context_window=30000
            )
            Settings.llm = self.llm
            Settings.embed_model = self.embed_model
            self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, prefer_grpc=False)
            self.vector_store = QdrantVectorStore(client=self.client, collection_name=settings.QDRANT_COLLECTION)
            self.index = VectorStoreIndex.from_vector_store(self.vector_store, embed_model=self.embed_model)
            self.chat_engines: Dict[str, Any] = {}
            self.postprocessor = SimilarityPostprocessor(similarity_cutoff=0.30)
            logger.info(f"✨ LifeRagEngine initialized")
        except Exception as e:
            logger.error(f"Initialization Error: {e}")
            raise e

    def get_chat_engine(self, session_id: str):
        if session_id not in self.chat_engines:
            memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
            self.chat_engines[session_id] = self.index.as_chat_engine(
                chat_mode="condense_plus_context", memory=memory, system_prompt=SYSTEM_PROMPT,
                node_postprocessors=[self.postprocessor], similarity_top_k=20
            )
        return self.chat_engines[session_id]

    def _detect_intents(self, lower_msg: str) -> Dict[str, bool]:
        """Rilevamento deterministico degli intenti."""
        is_spk = any(k in lower_msg for k in ["speaker", "protagonisti", "chi parla", "nomi", "ospiti", "chi è", "chi sono"])
        is_tot = any(k in lower_msg for k in ["tutti", "tutto", "completo", "elenco", "lista", "quali sono", "chi sono i", "chi sono gli"])
        is_fri = any(k in lower_msg for k in ["venerdì", "venerdi", "5 giugno", "05/06", "5/6", "day 1", "primo giorno"])
        is_sat = any(k in lower_msg for k in ["sabato", "6 giugno", "06/06", "6/6", "day 2", "secondo giorno"])
        is_morn = bool(re.search(r'\bmattina\b|\bmattino\b|\bore 09\b|\bore 10\b|\bore 11\b|\bore 12\b', lower_msg))
        is_aft = bool(re.search(r'\bpomeriggio\b|\bore 14\b|\bore 15\b|\bore 16\b|\bore 17\b|\bore 18\b', lower_msg))
        
        # Workshop e Ticket isolati
        is_workshop = "workshop" in lower_msg
        is_ticket = any(k in lower_msg for k in ["bigliett", "ticket", "eventbrite", "iscriv", "costa", "prezzo"])

        return {
            "sponsor": any(k in lower_msg for k in ["sponsor", "partner", "sostengono", "loghi", "chi supporta"]),
            "speaker": is_spk,
            "program": any(k in lower_msg for k in ["programma", "calendario", "cosa succede", "cosa c'è", "attività"]),
            "friday": is_fri, "saturday": is_sat, "morning": is_morn, "afternoon": is_aft, "total": is_tot,
            "workshop": is_workshop, "ticket": is_ticket
        }

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        if message.lower().strip() in ['ciao', 'buongiorno', 'hey']:
            return {"text": "Ciao! Sono il **Curatore AI** del LIFE Design Festival 2026. Come posso aiutartiə?", "images": [], "links": [], "source": "system"}

        try:
            chat_engine = self.get_chat_engine(session_id)
            lower_msg = message.lower()
            intents = self._detect_intents(lower_msg)
            
            # 1. INJECTION
            enhanced_message = message
            if intents["sponsor"]: enhanced_message += "\n(MANDATORIO: Usa [[REF:global-partners]])"
            elif intents["total"] or intents["speaker"]: enhanced_message += "\n(MANDATORIO: Usa [[REF:registry-speakers]])"
            
            if intents["program"] or intents["total"] or intents["workshop"]:
                enhanced_message += "\n(MANDATORIO: Usa i registri di programma, workshop e attività.)"

            response = chat_engine.chat(enhanced_message)
            response_text = str(response)
            found_tags = [t.lower().strip() for t in re.findall(r'\[\[REF:(.*?)\]\]', response_text)]
            
            # 2. BUILDING THE REGISTRY MAP
            node_map = {}
            registry_content_map = {}
            registry_link_map = {}
            
            for n in response.source_nodes:
                meta = n.node.metadata
                tid = (meta.get("id") or "").lower().strip()
                if tid: node_map[tid] = meta
                
                if "registry" in tid or "global-partners" in tid:
                    content = n.node.get_content()
                    registry_content_map[tid] = content
                    matches = re.findall(r'\[\[REF:(.*?)\]\].*?\((https?://.*?)\)', content)
                    for rid, url in matches: registry_link_map[rid.lower().strip()] = url.strip()
                    matches_raw = re.findall(r'\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)', content)
                    for rid, url in matches_raw: 
                        rid_clean = rid.lower().strip()
                        if rid_clean not in registry_link_map: registry_link_map[rid_clean] = url.strip()

            # 3. IDENTIFICAZIONE ENTITÀ ATTIVE (ID-CENTRIC)
            active_ids = set(found_tags)
            intent_date = "2026-06-05" if intents["friday"] else "2026-06-06" if intents["saturday"] else None
            
            # Match temporale blindato per Link Harvesting
            if intent_date:
                for tid, meta in node_map.items():
                    if isinstance(meta, dict) and meta.get("date") == intent_date:
                        n_time = meta.get("time", "00:00")
                        is_morn = "09:00" <= n_time <= "13:30"
                        is_aft = n_time > "13:30"
                        if (intents["morning"] and is_morn) or (intents["afternoon"] and is_aft):
                            active_ids.add(tid)
                        elif not intents["morning"] and not intents["afternoon"]:
                            active_ids.add(tid) # Full day match

            # Top Node Fallback (solo per domande singole)
            if not (intents["total"] or intents["sponsor"] or intent_date or intents["program"] or intents["workshop"]):
                top_id = (response.source_nodes[0].node.metadata.get("id") or "").lower().strip()
                if top_id and "registry" not in top_id: active_ids.add(top_id)

            # 4. RACCOLTA LINK (CATEGORIE ISOLATE)
            final_links = []
            if intents["ticket"] or any(k in lower_msg or k in response_text.lower() for k in ["ticket", "bigliett", "eventbrite"]):
                final_links.append("https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213")

            if intents["sponsor"]:
                if "global-partners" in registry_content_map:
                    urls = re.findall(r'https?://[^\s\)\],<>]+', registry_content_map["global-partners"])
                    for u in urls:
                        u_clean = u.strip('.,')
                        if u_clean not in final_links: final_links.append(u_clean)
            else:
                if intents["total"] and not intent_date:
                    if "registry-speakers" in registry_content_map:
                        urls = re.findall(r'https?://[^\s\)\],<>]+', registry_content_map["registry-speakers"])
                        for u in urls:
                            u_clean = u.strip('.,')
                            if u_clean not in final_links: final_links.append(u_clean)
                
                # Link degli ID attivi (Mappa Registro > Meta)
                for aid in active_ids:
                    link = registry_link_map.get(aid) or (node_map[aid].get("web") if aid in node_map else None)
                    if link and link not in final_links: final_links.append(link)

            # 5. ASSET RESOLUTION (ESCLUSIVITÀ TEMPORALE)
            final_images = []
            composite_ids = []
            
            if intents["sponsor"]:
                composite_ids.append("sponsor-wall")
            elif (intents["total"] or intents["program"] or intent_date) and not (intents["workshop"] or intents["ticket"]):
                day_prefix = "friday" if intents["friday"] else "saturday" if intents["saturday"] else None
                if day_prefix:
                    if intents["morning"]: composite_ids.append(f"gallery-{day_prefix}-morning")
                    elif intents["afternoon"]: composite_ids.append(f"gallery-{day_prefix}-afternoon")
                    else: composite_ids.extend([f"gallery-{day_prefix}-morning", f"gallery-{day_prefix}-afternoon"])
                elif intents["total"]:
                    composite_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"])

            # DETERMINAZIONE FINALE IMMAGINI
            if intents["workshop"] or intents["ticket"] or (len(active_ids) == 1 and not composite_ids):
                for aid in active_ids:
                    img = ASSET_REGISTRY.get(aid) or (node_map[aid].get("img") if aid in node_map else None)
                    if img and img not in final_images: final_images.append(img)
                final_images = final_images[:5]
            elif composite_ids:
                for cid in composite_ids:
                    if cid in ASSET_REGISTRY: final_images.append(ASSET_REGISTRY[cid])
            else:
                for aid in active_ids:
                    img = ASSET_REGISTRY.get(aid) or (node_map[aid].get("img") if aid in node_map else None)
                    if img and img not in final_images: final_images.append(img)
                final_images = final_images[:10]

            return {"text": re.sub(r'\[\[REF:.*?\]\]', '', response_text).strip(), "images": final_images, "links": final_links, "source": settings.MODEL_NAME}

        except Exception as e:
            logger.error(f"Query Error: {e}")
            return {"text": "Errore tecnico.", "images": [], "links": [], "source": "error"}
