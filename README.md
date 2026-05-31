# LIFE Design Festival 2026 - AI-Driven Ecosystem

> **Professional RAG Implementation for systemic design events.**

[Vite](https://vitejs.dev/)
[FastAPI](https://fastapi.tiangolo.com/)
[LlamaIndex](https://www.llamaindex.ai/)
[Qdrant](https://qdrant.tech/)

Questo repository ospita la piattaforma digitale ufficiale del **LIFE Design Festival 2026**. Non è solo un sito web, ma un ecosistema informativo potenziato da un'architettura **RAG (Retrieval-Augmented Generation)** progettata per ridefinire l'interazione tra partecipantə e festival.

---

## 👁️ Project Vision

In un'epoca di sovraccarico informativo, il LIFE 2026 introduce l'**AI Curator**: un assistente virtuale che non si limita a rispondere, ma agisce come un ponte semantico tra la visione del festival e le necessità dell'utente. Il sistema è progettato seguendo i principi del **Design Sistemico**, dove ogni pezzo di informazione (Talk, Speaker, Partner) è un'entità interconnessa in un grafo di conoscenza.

---

## 🧠 Architettura RAG (Deep Dive)

L'AI Curator utilizza una pipeline RAG altamente ingegnerizzata per garantire risposte empiriche, eliminando quasi totalmente il rischio di allucinazioni.

### 1. Ingestion & Atomic Metadata Injection

A differenza delle implementazioni standard, il nostro sistema di caricamento dati (`core/ingest.py`) utilizza una tecnica proprietaria di **Atomic Metadata Injection**:

- **Chunking Semantico**: Il testo non viene diviso per numero di caratteri, ma per unità logiche (Markdown headers).
- **Propagazione Metadati**: ID, percorsi immagini e link esterni vengono "iniettati" in ogni singolo frammento di testo. Questo garantisce che il contesto non vada mai perduto, indipendentemente dal punto in cui l'algoritmo di ricerca effettua il "retrieval".

### 2. Retrieval Strategy (Qdrant + HNSW)

Utilizziamo **Qdrant Cloud** come database vettoriale. La ricerca utilizza l'indice **HNSW (Hierarchical Navigable Small World)** per garantire:

- **Latenza Ultra-bassa**: Ricerca su migliaia di chunk in meno di 50ms.
- **Similarity Threshold**: Abbiamo implementato un `SimilarityPostprocessor` con un cutoff a **0.35**. Se l'informazione trovata non è pertinente almeno al 35% con la domanda, il sistema preferisce ammettere ignoranza piuttosto che inventare (Anti-Hallucination Guard).

### 3. Prompt Engineering & Identity

L'LLM (**Gemini 2.0 Flash**) è istruito tramite un system prompt complesso che gestisce:

- **Linguaggio Inclusivo**: Applicazione sistematica della Schwa (ə) in conformità con l'identità del festival.
- **Entity Linking**: Obbligo per il modello di generare tag `[[REF:id]]` che il backend intercetta per estrarre rich-media (immagini e link) in tempo reale.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 con TypeScript.
- **Routing**: React Router per una navigazione fluida.
- **Animations**: GSAP (ScrollTrigger) e Framer Motion per micro-interazioni di alto livello.
- **Experience**: Lenis Scroll per un'esperienza di navigazione "boutique".

### Backend

- **Core**: FastAPI (Asynchronous Python).
- **RAG Framework**: LlamaIndex (scelto per la superiore gestione dei metadati rispetto a LangChain).
- **Embedding**: `text-embedding-3-small` di OpenAI per una precisione vettoriale d'eccellenza.
- **LLM**: Google Gemini 2.0 Flash via OpenRouter.

---

## 📂 Struttura del Progetto

```text
├── src/                  # Frontend React
│   ├── components/       # Componenti atomici e molecolari
│   │   ├── ChatWidget.tsx # Il cuore dell'interazione AI
│   │   └── paint/        # Modulo interattivo PaintCanvas
│   └── data/             # JSON statici per il sito vetrina
├── backend/              # AI Curator Engine
│   ├── core/
│   │   ├── engine.py     # Pipeline di Query e Entity Linking
│   │   └── ingest.py     # Logica di vettorializzazione
│   ├── knowledge/        # Il dataset Markdown (Single Source of Truth)
│   └── main.py           # Endpoint API FastAPI
└── public/               # Asset statici (Font, Immagini, llms.txt)
```

---

## 🚀 Deployment & Maintenance

### Backend (Render.com)

Il backend è configurato per il deploy continuo su Render. Include una logica di **Keep-Alive** per gestire lo spin-down del piano gratuito, garantendo reattività costante.

### Frontend (Vercel)

Deploy automatico con ottimizzazione degli asset e gestione dei certificati SSL.

### AI-Ready Compliance

Il sito espone un file `public/llms.txt` seguendo i nuovi standard di "AI Crawling", permettendo ad agenti esterni (ChatGPT, Claude, Perplexity) di comprendere la struttura del festival in modo organico.

---

