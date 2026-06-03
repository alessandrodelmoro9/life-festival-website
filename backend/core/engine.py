import re
import os
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

def load_static_links() -> Dict[str, str]:
    """Carica in memoria i link da disco per garantire il 100% di hit rate sui bottoni."""
    links = {}
    try:
        knowledge_dir = os.path.join(os.path.dirname(__file__), "..", "knowledge")
        for filename in ["speaker-talk.md", "partner-sponsor.md", "programma-logistica.md"]:
            filepath = os.path.join(knowledge_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    matches = re.findall(r'\[\[REF:(.*?)\]\].*?\((https?://.*?)\)', content)
                    for rid, url in matches: links[rid.lower().strip()] = url.strip()
                    matches_raw = re.findall(r'\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)', content)
                    for rid, url in matches_raw: 
                        rid_clean = rid.lower().strip()
                        if rid_clean not in links: links[rid_clean] = url.strip()
    except Exception as e:
        logger.error(f"Error loading static links: {e}")
    return links

STATIC_REGISTRY_LINKS = load_static_links()

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
            logger.info(f"✨ LifeRagEngine initialized with {len(STATIC_REGISTRY_LINKS)} static links")
        except Exception as e:
            logger.error(f"Initialization Error: {e}")
            raise e

    def get_chat_engine(self, session_id: str, top_k: int = 20):
        # Usiamo una chiave composta per gestire engine con diversi top_k nello stesso session_id
        engine_key = f"{session_id}_{top_k}"
        if engine_key not in self.chat_engines:
            memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
            self.chat_engines[engine_key] = self.index.as_chat_engine(
                chat_mode="condense_plus_context", memory=memory, system_prompt=SYSTEM_PROMPT,
                node_postprocessors=[self.postprocessor], similarity_top_k=top_k
            )
        return self.chat_engines[engine_key]

    def _detect_intents(self, lower_msg: str) -> Dict[str, bool]:
        """Rilevamento deterministico degli intenti."""
        is_spk = any(k in lower_msg for k in ["speaker", "protagonisti", "chi parla", "nomi", "ospiti", "chi è", "chi sono", "parlano"])
        
        # Social e Alloggi
        is_social = any(k in lower_msg for k in ["social", "instagram", "facebook", "linkedin", "ig", "fb", "segui"])
        is_lodging = any(k in lower_msg for k in ["hotel", "dormire", "alloggio", "alloggiare", "b&b", "convento", "convenzionati", "dove stare"])

        # Intento TOTALE: attivato da parole chiave, ma DISATTIVATO se chiedi specificamente social o b&b
        is_tot = any(k in lower_msg for k in ["tutti", "tutto", "completo", "elenco", "lista", "quali sono", "chi sono i", "chi sono gli"])
        if is_social or is_lodging: is_tot = False

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
            "workshop": is_workshop, "ticket": is_ticket, "social": is_social, "lodging": is_lodging
        }

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        if message.lower().strip() in ['ciao', 'buongiorno', 'hey']:
            return {"text": "Ciao! Sono il **Curatore AI** del LIFE Design Festival 2026. Come posso aiutartiə?", "images": [], "links": [], "source": "system"}

        # Inizializzazione sicura di tutte le variabili di output
        final_links = []
        final_images = []
        active_ids = set()
        node_map = {}
        registry_content_map = {}
        registry_link_map = {}
        response_text = "Mi dispiace, non ho trovato informazioni specifiche su questo. Posso aiutartiə con il programma o i social?"

        try:
            lower_msg = message.lower()
            intents = self._detect_intents(lower_msg)
            
            # 1. ENHANCEMENT & QUERY
            enhanced_message = message
            top_k = 20
            if intents.get("program") or intents.get("total") or intents.get("speaker"):
                top_k = 40
                enhanced_message += "\n(MANDATORIO: Usa [[REF:registry-speakers]] e i registri di programma.)"
            
            if intents.get("sponsor"): enhanced_message += "\n(MANDATORIO: Usa [[REF:global-partners]])"
            if intents.get("lodging"): enhanced_message += "\n(MANDATORIO: Usa [[REF:ospitalita-convenzionata]])"

            chat_engine = self.get_chat_engine(session_id, top_k=top_k)
            response = chat_engine.chat(enhanced_message)
            
            # Estrazione sicura del testo e dei tag
            response_text = str(response) if response else response_text
            found_tags = [t.lower().strip() for t in re.findall(r'\[\[REF:(.*?)\]\]', response_text)]
            active_ids.update(found_tags)

            # 2. SOURCE NODES PROCESSING (NULL-SAFE)
            source_nodes = getattr(response, 'source_nodes', []) or []
            for n in source_nodes:
                if not n or not hasattr(n, 'node') or n.node is None: continue
                meta = getattr(n.node, 'metadata', {}) or {}
                tid = str(meta.get("id") or "").lower().strip()
                if tid: node_map[tid] = meta
                
                # Harvesting link dai registri
                if any(k in tid for k in ["registry", "global-partners", "ospitalita", "social-links"]):
                    content = n.node.get_content() or ""
                    registry_content_map[tid] = content
                    matches = re.findall(r'\[\[REF:(.*?)\]\].*?\((https?://.*?)\)', content)
                    for rid, url in matches: registry_link_map[rid.lower().strip()] = url.strip()
                    matches_raw = re.findall(r'\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)', content)
                    for rid, url in matches_raw: 
                        rid_clean = rid.lower().strip()
                        if rid_clean not in registry_link_map: registry_link_map[rid_clean] = url.strip()

            # 3. ENTITY MATCHING (ID-CENTRIC)
            intent_date = "2026-06-05" if intents.get("friday") else "2026-06-06" if intents["saturday"] else None
            if intent_date:
                for tid, meta in node_map.items():
                    if isinstance(meta, dict) and meta.get("date") == intent_date:
                        n_time = meta.get("time", "00:00")
                        is_morn = "09:00" <= n_time <= "13:30"
                        is_aft = n_time > "13:30"
                        if (intents.get("morning") and is_morn) or (intents.get("afternoon") and is_aft) or (not intents.get("morning") and not intents.get("afternoon")):
                            active_ids.add(tid)

            # Workshop Enhancement
            for aid in list(active_ids):
                if aid.startswith("workshop-"):
                    m = node_map.get(aid)
                    if m and m.get("speaker_id"): active_ids.add(str(m["speaker_id"]).lower().strip())

            # Fallback per domande singole (Top Node)
            if not any([intents.get(k) for k in ["total", "sponsor", "program", "workshop", "lodging", "social"]]) and not intent_date:
                if source_nodes and source_nodes[0] and hasattr(source_nodes[0], 'node') and source_nodes[0].node:
                    m = getattr(source_nodes[0].node, 'metadata', {}) or {}
                    top_id = str(m.get("id") or "").lower().strip()
                    if top_id and "registry" not in top_id: active_ids.add(top_id)

            # 4. LINK HARVESTING (CATEGORIZED)
            if intents.get("ticket") or "ticket" in response_text.lower():
                final_links.append("https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213")

            if intents.get("social"):
                final_links.extend(["https://www.instagram.com/life.designfestival/", "https://www.facebook.com/profile.php?id=61574592376779", "https://www.linkedin.com/company/life-design-festival/"])
            
            if intents.get("lodging"):
                final_links.extend(["http://alconventopotenza.it/", "https://minicasailsalonedigino.it", "https://www.myleucos.com", "https://www.blunottehouse.com/it/potenza"])

            if intents.get("sponsor") and "global-partners" in registry_content_map:
                urls = re.findall(r'https?://[^\s\)\],<>]+', registry_content_map["global-partners"])
                for u in urls:
                    u_c = u.strip('.,')
                    if u_c not in final_links: final_links.append(u_c)
            elif not intents.get("social"):
                # Programma generale / Speaker
                is_gen = intents.get("program") and not intent_date and not intents.get("morning") and not intents.get("afternoon")
                if (intents.get("total") or is_gen) and "registry-speakers" in registry_content_map:
                    urls = re.findall(r'https?://[^\s\)\],<>]+', registry_content_map["registry-speakers"])
                    for u in urls:
                        u_c = u.strip('.,')
                        if u_c not in final_links: final_links.append(u_c)
                
                # ID attivi
                for aid in active_ids:
                    m = node_map.get(aid) or {}
                    l = registry_link_map.get(aid) or STATIC_REGISTRY_LINKS.get(aid) or m.get("web")
                    if l and l not in final_links: final_links.append(l)

            # 5. ASSET RESOLUTION
            composite_ids = []
            if intents.get("social"): pass
            elif intents.get("sponsor"): composite_ids.append("sponsor-wall")
            elif (intents.get("total") or intents.get("program") or intent_date) and not (intents.get("workshop") or intents.get("ticket")):
                day = "friday" if intents.get("friday") else "saturday" if intents.get("saturday") else None
                if day:
                    if intents.get("morning"): composite_ids.append(f"gallery-{day}-morning")
                    elif intents.get("afternoon"): composite_ids.append(f"gallery-{day}-afternoon")
                    else: composite_ids.extend([f"gallery-{day}-morning", f"gallery-{day}-afternoon"])
                else:
                    composite_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"])

            if intents.get("workshop") or intents.get("ticket") or (len(active_ids) == 1 and not composite_ids):
                for aid in active_ids:
                    m = node_map.get(aid) or {}
                    img = ASSET_REGISTRY.get(aid) or m.get("img")
                    if img and img not in final_images: final_images.append(img)
                final_images = final_images[:5]
            elif composite_ids:
                for cid in composite_ids:
                    img = ASSET_REGISTRY.get(cid)
                    if img and img not in final_images: final_images.append(img)
            else:
                for aid in active_ids:
                    m = node_map.get(aid) or {}
                    img = ASSET_REGISTRY.get(aid) or m.get("img")
                    if img and img not in final_images: final_images.append(img)
                final_images = final_images[:10]

            return {"text": re.sub(r'\[\[REF:.*?\]\]', '', response_text).strip(), "images": final_images, "links": final_links, "source": settings.MODEL_NAME}

        except Exception as e:
            logger.error(f"Query Error: {e}")
            # Ritorno di emergenza: non crasha mai
            return {"text": "Ho riscontrato un'incertezza tecnica, ma ecco i nostri canali ufficiali.", "images": [], "links": ["https://www.instagram.com/life.designfestival/"], "source": "error"}
