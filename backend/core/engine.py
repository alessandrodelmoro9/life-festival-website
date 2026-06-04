import re
import os
import logging
from typing import List, Dict, Any
from llama_index.core import VectorStoreIndex, Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.openai_like import OpenAILike
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.memory import ChatMemoryBuffer
from qdrant_client import QdrantClient
from llama_index.core.postprocessor import SimilarityPostprocessor

from core.config import settings, SYSTEM_PROMPT, ASSET_REGISTRY

logger = logging.getLogger(__name__)

def load_static_links() -> Dict[str, str]:
    """
    Synchronizes knowledge IDs with their respective web URLs from local markdown files.
    Ensures 100% link resolution for button rendering.
    """
    links = {}
    try:
        knowledge_dir = os.path.join(os.path.dirname(__file__), "..", "knowledge")
        files = ["speaker-talk.md", "partner-sponsor.md", "programma-logistica.md", "visione-concept.md"]
        for filename in files:
            filepath = os.path.join(knowledge_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Standard Markdown link extraction
                    matches = re.findall(r'\[\[REF:(.*?)\]\].*?\((https?://.*?)\)', content)
                    for rid, url in matches: 
                        links[rid.lower().strip()] = url.strip()
                    # Raw URL extraction
                    matches_raw = re.findall(r'\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)', content)
                    for rid, url in matches_raw: 
                        rid_clean = rid.lower().strip()
                        if rid_clean not in links: links[rid_clean] = url.strip()
                    # JSON metadata extraction
                    meta_matches = re.findall(r'"id":\s*"(.*?)".*?"(?:web|links)":\s*(?:"(.*?)"|\[(.*?)\])', content)
                    for rid, web, links_list in meta_matches:
                        rid_clean = rid.lower().strip()
                        if web: links[rid_clean] = web.strip()
                        elif links_list:
                            first_link = re.search(r'"(https?://.*?)"', links_list)
                            if first_link: links[rid_clean] = first_link.group(1)
    except Exception as e:
        logger.error(f"Static Link Synchronization Error: {e}")
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
                context_window=30000,
                temperature=0.1
            )
            Settings.llm = self.llm
            Settings.embed_model = self.embed_model
            self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, prefer_grpc=False)
            self.vector_store = QdrantVectorStore(client=self.client, collection_name=settings.QDRANT_COLLECTION)
            self.index = VectorStoreIndex.from_vector_store(self.vector_store, embed_model=self.embed_model)
            self.chat_engines: Dict[str, Any] = {}
            self.postprocessor = SimilarityPostprocessor(similarity_cutoff=0.25)
            logger.info(f"Engine synchronized with {len(STATIC_REGISTRY_LINKS)} identifiers.")
        except Exception as e:
            logger.error(f"Engine Initialization Error: {e}")
            raise e

    def get_chat_engine(self, session_id: str, top_k: int = 20):
        engine_key = f"{session_id}_{top_k}"
        if engine_key not in self.chat_engines:
            memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
            self.chat_engines[engine_key] = self.index.as_chat_engine(
                chat_mode="condense_plus_context", memory=memory, system_prompt=SYSTEM_PROMPT,
                node_postprocessors=[self.postprocessor], similarity_top_k=top_k
            )
        return self.chat_engines[engine_key]

    def _detect_intents(self, lower_msg: str) -> Dict[str, bool]:
        """Determines semantic intent of the user message."""
        is_spk = any(k in lower_msg for k in ["speaker", "protagonisti", "chi parla", "nomi", "ospiti", "chi è", "chi sono", "parlano"])
        is_social = any(k in lower_msg for k in ["social", "instagram", "facebook", "linkedin", "ig", "fb", "segui"])
        is_lodging = any(k in lower_msg for k in ["hotel", "dormire", "alloggio", "alloggiare", "b&b", "convento", "convenzionati", "dove stare"])
        is_tot = any(k in lower_msg for k in ["tutti", "tutto", "completo", "elenco", "lista", "quali sono", "chi sono i", "chi sono gli"])
        if is_social or is_lodging: is_tot = False

        is_fri = any(k in lower_msg for k in ["venerdì", "venerdi", "5 giugno", "05/06", "5/6", "day 1", "primo giorno"])
        is_sat = any(k in lower_msg for k in ["sabato", "6 giugno", "06/06", "6/6", "day 2", "secondo giorno"])
        is_morn = bool(re.search(r'\bmattina\b|\bmattino\b|\bore 09\b|\bore 10\b|\bore 11\b|\bore 12\b', lower_msg))
        is_aft = bool(re.search(r'pomeriggio|pomeirggio|pomerigio|\bore 14\b|\bore 15\b|\bore 16\b|\bore 17\b|\bore 18\b', lower_msg))
        
        is_workshop = "workshop" in lower_msg
        is_ticket = any(k in lower_msg for k in ["bigliett", "ticket", "eventbrite", "iscriv", "costa", "prezzo"])
        is_team = any(k in lower_msg for k in ["organizz", "chi siete", "fiiico", "chi ha fatto", "chi cura", "curatori", "rossana", "federico", "michele", "massimiliano"])

        return {
            "sponsor": any(k in lower_msg for k in ["sponsor", "partner", "sostengono", "loghi", "chi supporta"]),
            "speaker": is_spk,
            "program": any(k in lower_msg for k in ["programma", "calendario", "cosa succede", "cosa c'è", "attività"]),
            "friday": is_fri, "saturday": is_sat, "morning": is_morn, "afternoon": is_aft, "total": is_tot,
            "workshop": is_workshop, "ticket": is_ticket, "social": is_social, "lodging": is_lodging,
            "team": is_team
        }

    def query(self, message: str, session_id: str = "default") -> Dict[str, Any]:
        """
        Executes a RAG query with timeframe-aware entity matching and asset resolution.
        """
        if message.lower().strip() in ['ciao', 'buongiorno', 'hey']:
            return {
                "text": "Ciao! Sono il **Curatore AI** del LIFE Design Festival 2026. Come posso aiutartiə?",
                "images": [],
                "links": [],
                "source": "system"
            }

        final_links = []
        final_images = []
        active_ids = set()
        node_map = {}
        registry_content_map = {}
        registry_link_map = {}
        response_text = "Mi dispiace, non ho trovato informazioni specifiche. Posso aiutartiə con il programma o i canali social?"

        try:
            lower_msg = message.lower()
            intents = self._detect_intents(lower_msg)
            
            # 1. Parameter Tuning
            top_k = 20
            enhanced_message = message
            if intents.get("program") or intents.get("total") or intents.get("speaker") or intents.get("afternoon"):
                top_k = 40
                enhanced_message += "\n(MANDATORIO: Usa [[REF:registry-speakers]] e tagga ogni speaker citato con [[REF:id]].)"
            
            if intents.get("sponsor"): enhanced_message += "\n(MANDATORIO: Usa [[REF:global-partners]])"
            if intents.get("lodging"): enhanced_message += "\n(MANDATORIO: Usa [[REF:ospitalita-convenzionata]])"

            # Specific Team Member vs Collective Logic
            is_specific_member = any(name in lower_msg for name in ["rossana", "federico", "michele", "massimiliano", "caggiano", "arleo", "luciani", "zaccagnino"])
            if intents.get("team"):
                if is_specific_member:
                    enhanced_message += "\n(MANDATORIO: Usa il tag [[REF:nome-cognome-vision]] specifico richiesto.)"
                else:
                    enhanced_message += "\n(MANDATORIO: Usa [[REF:fiiico-creative]])"

            # 2. RAG Execution
            chat_engine = self.get_chat_engine(session_id, top_k=top_k)
            response = chat_engine.chat(enhanced_message)
            response_text = str(response) if response else response_text
            
            # Extract explicitly cited identifiers
            found_tags = [t.lower().strip() for t in re.findall(r'\[\[REF:(.*?)\]\]', response_text)]
            active_ids.update(found_tags)

            # Safety Net: Heuristic identifier recovery
            for slug, url in STATIC_REGISTRY_LINKS.items():
                clean_name = slug.replace('-studio', '').replace('-design', '').replace('-creative', '').replace('-vision', '').replace('-', ' ')
                
                # Special handling for team members to avoid collective link leakage
                if slug.endswith('-vision') and is_specific_member:
                    if clean_name in lower_msg:
                        active_ids.add(slug)
                    continue

                if re.search(rf'\b{re.escape(clean_name)}\b', response_text.lower()):
                    active_ids.add(slug)

            # 3. Contextual Asset Resolution
            is_friday = intents.get("friday") or " 5 " in lower_msg
            is_saturday = intents.get("saturday") or " 6 " in lower_msg
            intent_date = "2026-06-05" if is_friday else "2026-06-06" if is_saturday else None

            # Source Metadata Processing
            source_nodes = getattr(response, 'source_nodes', []) or []
            for n in source_nodes:
                if not n or not hasattr(n, 'node') or n.node is None: continue
                meta = getattr(n.node, 'metadata', {}) or {}
                tid = str(meta.get("id") or "").lower().strip()
                if tid: node_map[tid] = meta
                
                # Registry Processing
                if any(k in tid for k in ["registry", "global-partners", "ospitalita", "social-links", "fiiico"]):
                    content = n.node.get_content() or ""
                    registry_content_map[tid] = content
                    matches = re.findall(r'\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)', content)
                    for rid, url in matches: registry_link_map[rid.lower().strip()] = url.strip()

            # Timeframe-Specific Entity Filtering
            if intent_date:
                for tid, meta in node_map.items():
                    if isinstance(meta, dict) and meta.get("date") == intent_date:
                        n_time = meta.get("time", "00:00")
                        is_morn = "09:00" <= n_time <= "13:30"
                        is_aft = n_time > "13:30"
                        if (intents.get("morning") and is_morn) or (intents.get("afternoon") and is_aft) or (not intents.get("morning") and not intents.get("afternoon")):
                            active_ids.add(tid)

            # 4. Global Link Resolution
            if intents.get("ticket") or "ticket" in response_text.lower():
                final_links.append("https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213")
            if intents.get("social"):
                final_links.extend(["https://www.instagram.com/life.designfestival/", "https://www.facebook.com/profile.php?id=61574592376779", "https://www.linkedin.com/company/life-design-festival/"])
            if intents.get("lodging"):
                final_links.extend(["http://alconventopotenza.it/", "https://minicasailsalonedigino.it", "https://www.myleucos.com", "https://www.blunottehouse.com/it/potenza"])

            # Link Harvesting: Precision mapping based on explicitly cited or detected IDs
            for aid in active_ids:
                # Filter collective IDs when specific member is requested
                if is_specific_member and aid in ["fiiico-creative", "fiiico-creative-vision", "retro-gusto"]:
                    if not any(name in aid for name in ["rossana", "federico", "michele", "massimiliano"]):
                        continue

                l = registry_link_map.get(aid) or STATIC_REGISTRY_LINKS.get(aid) or node_map.get(aid, {}).get("web")
                if l and l not in final_links: final_links.append(l)

            # Deduplication
            final_links = list(dict.fromkeys(final_links))

            # 5. Asset Hierarchy Resolution
            composite_ids = []
            if intents.get("sponsor"):
                composite_ids.append("sponsor-wall")
            elif (intents.get("total") or intents.get("program") or intent_date) and not (intents.get("workshop") or intents.get("ticket")):
                day = "friday" if is_friday else "saturday" if is_saturday else None
                if day:
                    if intents.get("morning"): composite_ids.append(f"gallery-{day}-morning")
                    elif intents.get("afternoon"): composite_ids.append(f"gallery-{day}-afternoon")
                    else: composite_ids.extend([f"gallery-{day}-morning", f"gallery-{day}-afternoon"])
                else:
                    composite_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"])

            # Rule: Composite Galleries suppress Individual Assets
            if composite_ids:
                for cid in composite_ids:
                    img = ASSET_REGISTRY.get(cid)
                    if img and img not in final_images: final_images.append(img)
            else:
                limit = 5 if (intents.get("workshop") or intents.get("ticket") or len(active_ids) <= 2) else 10
                for aid in active_ids:
                    m = node_map.get(aid) or {}
                    img = ASSET_REGISTRY.get(aid) or m.get("img")
                    if img and img not in final_images: final_images.append(img)
                final_images = final_images[:limit]

            return {
                "text": re.sub(r'\[\[REF:.*?\]\]', '', response_text).strip(),
                "images": final_images,
                "links": final_links,
                "source": settings.MODEL_NAME
            }

        except Exception as e:
            logger.error(f"Query Execution Error: {e}")
            return {
                "text": "Ho riscontrato un'incertezza tecnica, ma ecco i nostri canali ufficiali.",
                "images": [],
                "links": ["https://www.instagram.com/life.designfestival/"],
                "source": "error"
            }
