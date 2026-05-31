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
                "- **WORKSHOP E BIGLIETTI (MANDATORIO)**: Se parli dei WORKSHOP o dell'iscrizione, DEVI indicare IMMEDIATAMENTE il PREZZO (es: 'Ticket: €25') e specificare che sono acquistabili su Eventbrite.\n"
                "- **PROATTIVITÀ**: Chiudi SEMPRE con una domanda pertinente.\n"
                "- **ENTITY LINKING (MANDATORIO)**: Ogni volta che nomini uno speaker, sponsor, workshop o attività, DEVI aggiungere il tag: [[REF:id]].\n"
                "- **RECOLA PER GLI ELENCHI**: In liste lunghe o cronoprogrammi, DEVI inserire il tag [[REF:id]] per OGNI SINGOLA RIGA. È fondamentale per mostrare le immagini di tuttə lə speaker.\n"
                "  Esempio: '- 10:30 | Simone Checchia [[REF:simone-checchia]]'\n"
                "- **ELENCO PARTNER/SPONSOR**: Quando elenchi i partner, DEVI suddividerli per categoria (es: **MAIN SPONSOR**, **EXPERIENCE SPONSOR**, ecc.) usando il GRASSETTO per il nome della categoria e un elenco puntato per i partner sotto di essa, includendo sempre il tag [[REF:id]].\n"
                "- **IMMAGINI COMPOSITE (BANNER)**: Quando l'utente chiede informazioni generali su TUTTI lə speaker, o l'intero programma del festival, oppure l'elenco completo degli interventi, DEVI aggiungere all'inizio della risposta TUTTI e 4 i tag delle gallery cronoprogramma per mostrare il quadro completo:\n"
                "  - [[REF:gallery-friday-morning]]\n"
                "  - [[REF:gallery-friday-afternoon]]\n"
                "  - [[REF:gallery-saturday-morning]]\n"
                "  - [[REF:gallery-saturday-afternoon]]\n"
                "  **REGOLA GIORNO SINGOLO**: Se l'utente chiede di un INTERO GIORNO (es: 'cosa succede sabato' o 'chi parla il 5 giugno'), DEVI usare ENTRAMBI i tag del giorno (mattina e pomeriggio).\n"
                "  Usa un solo tag solo se viene chiesta specificamente una fascia oraria (es: 'venerdì mattina').\n"
                "  - Tutti gli sponsor -> [[REF:sponsor-wall]]\n"
                "  - Speaker Venerdì Mattina -> [[REF:gallery-friday-morning]]\n"
                "  - Speaker Venerdì Pomeriggio -> [[REF:gallery-friday-afternoon]]\n"
                "- Usa SOLO le informazioni fornite nel CONTESTO.\n"
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
            
            logger.info("✨ LifeRagEngine initialized successfully")
            
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
                "text": "Ciao! Sono il **Curatore AI** del LIFE Design Festival 2026. Come posso aiutartiə?",
                "images": [], "links": [], "source": "system"
            }

        try:
            chat_engine = self.get_chat_engine(session_id)
            
            # --- PHASE 1: INTELLIGENT INJECTION (TEMPORAL & CATEGORICAL) ---
            enhanced_message = message
            lower_msg = message.lower()
            
            # 1. Full Set Triggers (Program/Speakers)
            all_set_triggers = ["tutti", "tutto", "completo", "elenco", "lista", "chi sono", "protagonisti", "speaker", "programma", "cronoprogramma"]
            if any(k in lower_msg for k in all_set_triggers) and not any(d in lower_msg for d in ["venerdì", "sabato", "5", "6"]):
                enhanced_message += "\n(MANDATORIO: Usa i tag [[REF:gallery-friday-morning]] [[REF:gallery-friday-afternoon]] [[REF:gallery-saturday-morning]] [[REF:gallery-saturday-afternoon]] e consulta [[REF:registry-speakers]] [[REF:registry-program-cards]])"
            
            # 2. Friday Triggers (Day 1)
            friday_triggers = ["venerdì", "venerdi", "5 giugno", "primo giorno", "day 1"]
            if any(k in lower_msg for k in friday_triggers):
                enhanced_message += "\n(MANDATORIO: Usa i tag [[REF:gallery-friday-morning]] [[REF:gallery-friday-afternoon]])"
                
            # 3. Saturday Triggers (Day 2)
            saturday_triggers = ["sabato", "6 giugno", "secondo giorno", "day 2", "domani"]
            if any(k in lower_msg for k in saturday_triggers):
                enhanced_message += "\n(MANDATORIO: Usa i tag [[REF:gallery-saturday-morning]] [[REF:gallery-saturday-afternoon]])"

            # 4. Activities & Stands
            if any(k in lower_msg for k in ["attività", "stand", "fare", "lab", "esperienza"]):
                enhanced_message += "\n(MANDATORIO: Consulta [[REF:registry-activities]] ed elenca TUTTE e 6 le attività presenti)"

            # 5. Workshops & Tickets
            if any(k in lower_msg for k in ["workshop", "laboratori", "imparare", "biglietti", "eventbrite"]):
                enhanced_message += "\n(MANDATORIO: Consulta [[REF:registry-workshops]] e fornisci i link Eventbrite)"

            # 6. Partners & Sponsors
            if any(k in lower_msg for k in ["partner", "sponsor", "sostengono", "chi supporta"]):
                enhanced_message += "\n(MANDATORIO: Consulta [[REF:global-partners]] e [[REF:sponsor-wall]]. Elenca TUTTI i partner suddivisi per categoria come indicato nel registro.)"

            response = chat_engine.chat(enhanced_message)
            response_text = str(response)
            
            # Extraction of Entity Tags [[REF:id]]
            entity_tags = re.findall(r'\[\[REF:(.*?)\]\]', response_text)
            
            # --- PHASE 2: DETERMINISTIC ASSET OVERRIDE (EXCLUSIVE CATEGORIES) ---
            forced_gallery_ids = []
            
            # 1. Intent Detection
            is_sponsor_topic = any(k in lower_msg for k in ["sponsor", "partner", "sostengono", "loghi", "chi supporta", "collaborano"])
            is_speaker_topic = any(k in lower_msg for k in ["speaker", "protagonisti", "chi parla", "nomi", "interventi", "chi c'è", "chi partecipa"])
            is_program_topic = any(k in lower_msg for k in ["programma", "cronoprogramma", "agenda", "calendario", "orari", "appuntamenti", "succede", "fanno", "cosa c'è"])
            
            # Temporal Detection (Strict)
            is_friday = any(k in lower_msg for k in ["venerdì", "venerdi", "5 giugno", "primo giorno", "day 1"])
            is_saturday = any(k in lower_msg for k in ["sabato", "6 giugno", "secondo giorno", "day 2", "domani"])
            
            # Use regex for strict matching of morning/afternoon to avoid partial matches
            is_morning = bool(re.search(r'\bmattina\b|\bmattino\b|\bore 09\b|\bore 10\b|\bore 11\b|\bore 12\b', lower_msg))
            is_afternoon = bool(re.search(r'\bpomeriggio\b|\bpomeridiano\b|\bore 14\b|\bore 15\b|\bore 16\b|\bore 17\b|\bore 18\b|\bore 19\b', lower_msg))
            
            # Special case: "Tutti" or "Tutto" (Must be a broad list request)
            is_total_request = any(k in lower_msg for k in ["tutti", "tutto", "completo", "elenco", "lista"]) or (lower_msg.strip().endswith("speaker") or lower_msg.strip().endswith("speaker?"))

            # 2. Logic Execution (EXCLUSIVE)
            
            # SCENARIO A: SPONSORS (Highest Priority)
            if is_sponsor_topic:
                forced_gallery_ids.append("sponsor-wall")

            # SCENARIO B: SPEAKERS / PROGRAM
            # If it's a "total" request, force all banners.
            if is_total_request and not (is_friday or is_saturday):
                forced_gallery_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"])
            
            # If a specific day/time is requested for the PROGRAM, force galleries.
            # We don't force them if it's just a general question about speakers.
            if is_program_topic or is_friday or is_saturday:
                if is_friday:
                    if is_morning and not is_afternoon:
                        forced_gallery_ids.append("gallery-friday-morning")
                    elif is_afternoon and not is_morning:
                        forced_gallery_ids.append("gallery-friday-afternoon")
                    else:
                        forced_gallery_ids.extend(["gallery-friday-morning", "gallery-friday-afternoon"])
                
                if is_saturday:
                    if is_morning and not is_afternoon:
                        forced_gallery_ids.append("gallery-saturday-morning")
                    elif is_afternoon and not is_morning:
                        forced_gallery_ids.append("gallery-saturday-afternoon")
                    else:
                        forced_gallery_ids.extend(["gallery-saturday-morning", "gallery-saturday-afternoon"])

            # 3. Deduplicate and Finalize candidates
            all_tag_candidates = []
            seen_tags = set()
            
            # --- FINAL INTENT ENFORCEMENT (STRICT EXCLUSIVITY) ---
            # If user specified Morning but NOT Afternoon, remove any Afternoon tags the AI might have added
            temp_all = forced_gallery_ids + entity_tags
            if is_morning and not is_afternoon:
                temp_all = [t for t in temp_all if "afternoon" not in t.lower()]
            if is_afternoon and not is_morning:
                temp_all = [t for t in temp_all if "morning" not in t.lower()]

            for tid in temp_all:
                ctid = tid.lower().strip()
                if ctid not in seen_tags:
                    all_tag_candidates.append(ctid)
                    seen_tags.add(ctid)
            
            # 4. Cleanup of response text
            clean_text = re.sub(r'\[\[REF:.*?\]\]', '', response_text).strip()
            
            # Empty Response Fallback
            if not clean_text or clean_text.lower() == "empty response":
                 clean_text = "Mi scuso, ma non ho trovato informazioni specifiche su questo. Prova a chiedermi del programma o di uno speaker!"

            final_images = []
            final_links = []
            
            # 3. Collect Candidates from Source Nodes (and hard-coded registry mapping)
            candidates = {} 
            for node in response.source_nodes:
                meta = node.node.metadata
                if "id" in meta:
                    candidates[meta["id"].lower().strip()] = meta
            
            # FALLBACK METADATA
            hardcoded_composites = {
                "gallery-friday-morning": {"id": "gallery-friday-morning", "type": "composite", "img": "/assets/composite/5_giugno_mattina.webp"},
                "gallery-friday-afternoon": {"id": "gallery-friday-afternoon", "type": "composite", "img": "/assets/composite/5_giugno_pomeriggio.webp"},
                "gallery-saturday-morning": {"id": "gallery-saturday-morning", "type": "composite", "img": "/assets/composite/6_giugno_mattina.webp"},
                "gallery-saturday-afternoon": {"id": "gallery-saturday-afternoon", "type": "composite", "img": "/assets/composite/6_giugno_pomeriggio.webp"},
                "sponsor-wall": {"id": "sponsor-wall", "type": "composite", "img": "/assets/logos/Partner & Sponsor.webp"}
            }

            # 4. Filter and Select Images (MAGAZINE STYLE)
            images_to_show = []
            seen_images = set()
            
            requested_metas = []
            for tag_id in all_tag_candidates:
                clean_tag = tag_id.lower().strip()
                if clean_tag in hardcoded_composites:
                    requested_metas.append(hardcoded_composites[clean_tag])
                elif clean_tag in candidates:
                    requested_metas.append(candidates[clean_tag])
            
            # --- THE "7 IMAGES FLOOD" FIX ---
            # We count only non-composite entities (speakers/sponsors)
            individual_count = len([m for m in requested_metas if m.get("type") != "composite"])
            has_forced_composite = any(m.get("type") == "composite" for m in requested_metas)
            
            # If we have too many individuals (> 7) and NO composite was forced by intent, 
            # we switch to the Full Gallery set and block individuals.
            if individual_count > 7 and not has_forced_composite:
                for gid in ["gallery-friday-morning", "gallery-friday-afternoon", "gallery-saturday-morning", "gallery-saturday-afternoon"]:
                    requested_metas.insert(0, hardcoded_composites[gid])
                has_forced_composite = True
            
            for meta in requested_metas:
                m_type = meta.get("type")
                m_img = meta.get("img")
                
                if m_img and m_img not in seen_images:
                    # If we have a composite (either forced by intent or by >7 threshold), 
                    # we ONLY show composites to maintain Magazine Style.
                    if has_forced_composite:
                        if m_type == "composite":
                            images_to_show.append(m_img)
                            seen_images.add(m_img)
                    else:
                        # No composite? Show everything found (limited by threshold logic above)
                        images_to_show.append(m_img)
                        seen_images.add(m_img)
                
                if "web" in meta and meta["web"] not in final_links:
                    final_links.append(meta["web"])

            # 5. Fail-Safe URL Harvesting (Always catch links in text)
            all_urls = re.findall(r'(https?://[^\s\)\],<>]+)', response_text)
            for url in all_urls:
                clean_url = url.strip('.,')
                if clean_url not in final_links:
                    final_links.append(clean_url)

            # 6. Fallback for Founder Names
            if not has_forced_composite:
                for founder, entity_id in self.founder_map.items():
                    if founder in lower_msg:
                        clean_eid = entity_id.lower().strip()
                        if clean_eid in candidates:
                            meta = candidates[clean_eid]
                            if meta.get("img") and meta["img"] not in seen_images:
                                images_to_show.append(meta["img"])
                                seen_images.add(meta["img"])
                            if "web" in meta and meta["web"] not in final_links:
                                final_links.append(meta["web"])

            return {
                "text": clean_text,
                "images": images_to_show,
                "links": final_links,
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
