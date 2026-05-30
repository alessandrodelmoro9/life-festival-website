# Life Design Festival 2026

Il sito ufficiale della seconda edizione del Life Design Festival a Potenza (5-6 Giugno 2026). Una piattaforma interattiva che unisce design sistemico, interattività AI e un'esperienza utente fluida.

## 🚀 Quick Start

### Frontend (React/Vite)

1. Installa le dipendenze: `npm install`
2. Avvia in sviluppo: `npm run dev`
3. Build per produzione: `npm run build`

### Backend (AI Curator - RAG)

Il backend gestisce l'AI Curator basato su LlamaIndex.

1. Assicurati di avere Python 3.10+ e [Poetry](https://python-poetry.org/) installati.
2. Entra nella cartella: `cd backend`
3. Installa le dipendenze: `poetry install`
4. Configura il file `.env` con le chiavi: `OPENROUTER_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`.
5. (Opzionale) Esegui l'ingestione dei dati se hai modificato la knowledge base: `poetry run python core/ingest.py`
6. Avvia il server: `poetry run python main.py` (disponibile su `http://localhost:8000`)

---

## 🧠 Architettura del Backend 

Il festival integra un chatbot **RAG (Retrieval-Augmented Generation)** avanzato:

### Componenti Core

- **Motore AI**: LlamaIndex per l'orchestrazione del contesto.
- **Modello**: Google Gemini 2.0 Flash via OpenRouter per risposte rapide e precise.
- **Vector DB**: Qdrant Cloud per la ricerca semantica.
- **Knowledge Base**: Moduli Markdown in `backend/knowledge/` che coprono:
  - `visione-concept.md`: L'anima del festival.
  - `programma-logistica.md`: Orari, ticket e info pratiche.
  - `speaker-talk.md`: Bio complete e abstract dei talk.
  - `partner-sponsor.md`: Ecosistema dei sostenitori.

### Logica di "Entity Linking"

L'AI Curator non si limita a rispondere, ma "collega" le entità. Ogni volta che nomina uno speaker o uno sponsor, estrae i metadati (immagini, link social, siti web) dal Vector DB e li invia al frontend per una visualizzazione ricca.

---

## 🎨 Frontend & Design

- **Styling**: Tailwind CSS per il layout, Framer Motion per le micro-interazioni e GSAP per le animazioni di scroll.
- **User Experience**: Scroll fluido tramite Lenis, cursore personalizzato e sistema di pittura interattiva (`PaintCanvas`).
- **SEO Semantica**: Utilizzo rigoroso della gerarchia H1-H6 scollegata dallo stile visivo per massimizzare l'indicizzazione senza compromettere il design.

---

## 🛠️ Struttura SEO & AI-Ready

Il progetto segue standard moderni per la visibilità:

- `**llms.txt`**: Fornisce un contesto strutturato per gli agenti AI (ChatGPT, Claude, Perplexity) che scansionano il sito.
- **Iubenda Prior Blocking**: Gestione cookie conforme al GDPR con blocco preventivo dei cookie di profilazione.
- **JSON-LD**: Dati strutturati per eventi Google per far apparire i talk nei risultati di ricerca.

## 🌍 Deploy

- **Frontend**: Vercel (connessione automatica al branch `main`).
- **Backend**: Render.com (configurato per auto-deploy via GitHub).

---

## 📂 Struttura del Progetto (Monorepo)

```text
life-design-scroll/
├── frontend/ (Root directory)
│   ├── public/           # Asset statici (Immagini, Font, llms.txt)
│   ├── src/              # React Components, Hooks, Data
│   └── index.html        # Entry point con script Iubenda
│
└── backend/              # AI Curator Engine
    ├── pyproject.toml    # Gestione dipendenze (Poetry)
    ├── main.py           # FastAPI Server Entry Point
    ├── core/
    │   ├── engine.py     # LlamaIndex RAG Pipeline & Prompting
    │   └── ingest.py     # Qdrant Vectorization & Metadata Injection
    └── knowledge/        # Markdown Knowledge Base
```

---

## 🧠 Deep Dive Tecnico (Architettura RAG)

Il backend non è un semplice wrapper di ChatGPT, ma un sistema di **Retrieval-Augmented Generation (RAG)** altamente ingegnerizzato, progettato per superare i limiti di contesto e fornire risposte empiriche.

### 1. Ingestion (`core/ingest.py`) e "Atomic Metadata"

Durante la fase di build, lo script di ingestione analizza i file markdown nella cartella `knowledge/`. Non esegue uno split del testo casuale (come avviene nei tutorial standard), ma utilizza una logica di **Atomic Metadata Injection**:

- Cerca specifici blocchi semantici identificati da un titolo e da un JSON `> **METADATA`**.
- Propaga le informazioni del JSON (ID, path dell'immagine, url) a *tutti* i chunk (frammenti) generati da quel blocco di testo.
- In questo modo, anche se l'LLM pesca una frase isolata a metà di una biografia, il database vettoriale sa esattamente a quale "Entità" appartiene.

### 2. Perché Qdrant Cloud?

Abbiamo scelto **Qdrant** come Vector Database per tre motivi accademici/tecnici:

- **Prestazioni HNSW**: Qdrant utilizza un algoritmo Hierarchical Navigable Small World (HNSW) scritto in Rust, garantendo latenze di ricerca sotto i 50ms anche su dataset enormi.
- **Payload Filtering**: A differenza di Pinecone (nella sua versione free), Qdrant permette un filtraggio severo sui metadati (`Payload`), essenziale per isolare "Speaker" da "Sponsor" durante le query incrociate.
- **Gestione in memoria**: Si integra nativamente in ambienti serverless come Render senza sovraccaricare la RAM del container FastAPI.

### 3. Perché LlamaIndex (e non LangChain)?

Nel panorama dei framework AI, la scelta è ricaduta su **LlamaIndex** rispetto a LangChain per una precisa esigenza architetturale:

- **Focus sul Retrieval**: LangChain è un framework "general-purpose" (ottimo per agenti autonomi multimodali), mentre LlamaIndex è iper-ottimizzato per la connessione tra dati proprietari e LLM.
- **Post-Processing**: LlamaIndex ci ha permesso di implementare nativamente un `SimilarityPostprocessor` che taglia via (cutoff) i risultati con pertinenza inferiore al 35%, eliminando matematicamente le allucinazioni causate da "rumore" nel database.

### 4. Engine (`core/engine.py`) ed "Entity Linking"

Il ciclo di vita di una query:

1. L'utente invia una domanda tramite il `ChatWidget` React.
2. `engine.py` (tramite FastAPI) vettorializza la query e interroga Qdrant.
3. Il contesto recuperato viene iniettato nel System Prompt di **Gemini 2.0 Flash**.
4. Il System Prompt obbliga il modello a inserire dei **Tag di Riferimento** (es: `[[REF:auge-design]]`) ogniqualvolta cita un'entità.
5. Un'espressione regolare (Regex) in Python intercetta questi tag prima di inviare la risposta al frontend, li usa per recuperare in frazioni di secondo le immagini e i link dal database vettoriale, e ripulisce il testo.
6. Il Frontend riceve un JSON strutturato con testo pulito, array di immagini e array di link.

---

© 2026 Life Design Festival. Made with love, code & design.