import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Dict, List

class Settings(BaseSettings):
    # API Keys & URLs
    QDRANT_URL: str = Field(..., env="QDRANT_URL")
    QDRANT_API_KEY: str = Field(..., env="QDRANT_API_KEY")
    OPENROUTER_API_KEY: str = Field(..., env="OPENROUTER_API_KEY")
    QDRANT_COLLECTION: str = "life_design_festival"
    
    # Environment
    ENV: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    
    # Models
    MODEL_NAME: str = "google/gemini-2.5-flash"
    EMBED_MODEL_NAME: str = "text-embedding-3-small"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "https://lifedesignfestival.it",
        "https://www.lifedesignfestival.it",
        "https://life-design-scroll.vercel.app"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# --- PROFESSIONAL PROMPTS ---
SYSTEM_PROMPT = (
    "Sei l'AI Curator del LIFE Design Festival 2026. "
    "Il tuo tono è professionale, ispirazionale e curatoriale (stile 'Design Magazine').\n\n"
    "REGOLE DI RISPOSTA (MANDATORIE):\n"
    "- **NO EMOJI**: Non usare MAI emoji.\n"
    "- **NO TABELLE**: Non usare MAI tabelle. Usa elenchi puntati.\n"
    "- **NO LINK NEL TESTO**: Non includere MAI URL o link cliccabili nel testo della risposta. I link vengono estratti automaticamente dai metadati tramite i tag REF.\n"
    "- **SUDDIVISIONE ORARIA**: Quando presenti il programma, dividi le sessioni usando '**MATTINA**' e '**POMERIGGIO**'. Non usare ### o altri header.\n"
    "- **FORMATO ELENCO**: Ogni speaker o attività deve seguire questo schema: '- **Ora** | Nome [[REF:id]] - Descrizione breve.'. È FONDAMENTALE usare sempre il tag [[REF:id]] per ogni entità citata per attivare i bottoni dei link.\n"
    "- **SPONSOR E PARTNER**: Trattali come un unico ecosistema. Se chiedono degli sponsor, elenca tutte le categorie del registro globale.\n"
    "- **LINGUAGGIO INCLUSIVO**: Usa la Schwa (ə) per i plurali misti.\n"
    "- **DISCORSIVITÀ**: Sii descrittivə e fluido. Spiega brevemente il concept dei talk se richiesto.\n"
    "- **CHIUSURA**: Concludi SEMPRE la risposta con una domanda aperta e pertinente per stimolare la curiosità dell'utente.\n"
    "- Usa SOLO le informazioni del CONTESTO."
)

# --- DETERMINISTIC ASSET REGISTRY ---
# Questo risolve i problemi di nomi file errati o spazi extra
ASSET_REGISTRY = {
    "gallery-friday-morning": "/assets/composite/5_giugno_mattina.webp",
    "gallery-friday-afternoon": "/assets/composite/5_giugno_pomeriggio.webp",
    "gallery-saturday-morning": "/assets/composite/6_giugno_mattina.webp",
    "gallery-saturday-afternoon": "/assets/composite/6_giugno_pomeriggio.webp",
    "sponsor-wall": "/assets/logos/Partner & Sponsor.webp",
    "registry-speakers": None, # Solo per query context
    "registry-program-cards": None,
    "registry-activities": None,
    "registry-workshops": None,
    "global-partners": None
}

# --- FOUNDER TO ENTITY MAPPING ---
FOUNDER_MAP = {
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
    "alfredo avena": "avena",
    "zetafonts": "zetafonts"
}
