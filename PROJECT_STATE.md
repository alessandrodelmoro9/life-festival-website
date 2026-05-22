# Project State - Life Design Festival 2026

## 🎯 Overall Goal
Implement a high-performance, secure, and cost-effective RAG Chatbot for the Life Design Festival 2026, using a Monorepo structure that keeps the production frontend isolated and stable.

## 🛠️ Active Constraints & Standards
- **Monorepo Security**:
  - `backend/` is isolated from `main` branch deployments via `.vercelignore` and `.gitignore`.
  - **Zero-Exposure Policy**: API Keys (Google, OpenRouter, Qdrant) reside ONLY in `backend/.env` (locally) and Render.com Secret Environment Variables (production).
  - Double-layered `.gitignore` (Root + Backend) prevents credential leakage.
- **AI & RAG Architecture (Hybrid Strategy)**:
  - **Core Framework**: LlamaIndex (chosen for superior Metadata/Citation support).
  - **Vector DB**: Qdrant Cloud (Free Tier - Serverless) for persistent, remote memory.
  - **Embedding**: `text-embedding-004` (Google) - High performance at zero cost.
  - **LLM Strategy**: 
    - *Primary*: Google Gemini 1.5 Flash (Free Tier).
    - *Fallback/Pro*: OpenRouter (Prepaid credits for DeepSeek/GPT-4o-mini).
- **Knowledge Base Structure**:
  - `03_SPEAKER_BIO.md`: Structured "Identity" data (Bios, Socials, Official Links).
  - `04_TALKS_ABSTRACTS.md`: "Content" data (Speech titles, philosophy, detailed abstracts).
  - `05_PRESS_E_CITAZIONI.md`: External articles and press mentions with verifiable source URLs.
- **Infrastructure**:
  - **Frontend**: Vercel (`lifedesignfestival.it`).
  - **Backend**: Render.com (Auto-deploy from `feature/backend-setup`).
  - **DNS**: API mapped to `api.lifedesignfestival.it` via CNAME.
  - **Keep-Alive**: `cron-job.org` pinging every 14 min to prevent Render Free Tier sleep.

## 🚀 Roadmap Operativa (7 Giorni al Lancio)

### Giorni 1-2: Chiusura KB & Setup Tecnico
- [ ] **Revisione Finale (Utente)**: Ultime modifiche manuali a Ticket (03), Talk (05) e Workshop (07).
- [ ] **Setup Ambiente**: Configurazione Poetry (LlamaIndex, FastAPI, Qdrant) e ripristino `.gitignore` root.
- [ ] **API Handshake**: Creazione `.env` e test connessione con Google Gemini e Qdrant Cloud.

### Giorni 3-4: Ingestion & RAG Logic
- [ ] **Data Ingestion**: Caricamento dei file Markdown su Qdrant Cloud preservando metadati e link.
- [ ] **RAG Tuning**: Ottimizzazione del System Prompt per il tono di voce e la gestione dei link (con favicons).

### Giorni 5-6: Sviluppo API & Widget UI
- [ ] **FastAPI Backend**: Implementazione endpoint `/chat` in streaming su Render.com.
- [ ] **React Widget**: Sviluppo del componente chat nel frontend (Vercel) con integrazione link professionali.

### Giorni 7-8: Testing & Produzione
- [ ] **User Testing**: Invio link di staging per prove di "stress" sul chatbot.
- [ ] **Go Live**: Collegamento finale al dominio `api.lifedesignfestival.it` e monitoraggio.

## ✅ Task Completati
- [x] **01_CONCEPT_E_VISIONE**: Revisionato e arricchito con filosofia 2025/2026.
- [x] **02_PROGRAMMA_E_ORARI**: Strutturato per blocchi dinamici e networking.
- [x] **04_SPEAKER_IDENTITY**: Arricchito con bio integrali, progetti 2024-2025 e link web.
- [x] **06_PARTNER_E_SPONSOR**: Aggiornato con dettagli tecnici (Metaglass, Fondo Etico) e link.
- [x] **Pulizia 2025**: Eliminati tutti i file obsoleti e i vecchi database locali.
- [x] **Branching**: Setup del ramo `feature/backend-setup` isolato dal frontend stabile.
