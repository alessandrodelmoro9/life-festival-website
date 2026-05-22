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

## 🚀 Step-by-Step Roadmap

### Phase 1: Knowledge Base Refinement (CURRENT)
- [ ] **Data Segregation**: Split existing 2026 drafts into "Identity" (Bios) vs "Content" (Talks).
- [ ] **Web Research Enrichment**: Integrate external articles and background info for speakers/partners.
- [ ] **Metadata Mapping**: Ensure every chunk has a source URL and a reference to its category (Speaker/Partner/Press).

### Phase 2: Technical Environment Setup
- [ ] **Poetry Configuration**: Update `pyproject.toml` with LlamaIndex, FastAPI, and Qdrant-client.
- [ ] **Security Handshake**: Create local `backend/.env` with placeholders for User to fill.
- [ ] **Backend .gitignore Verification**: Re-confirm isolation of local credentials.

### Phase 3: RAG Engine & Ingestion
- [ ] **Ingestion Script**: Build `ingest.py` to process the new Markdown structure and upload to Qdrant Cloud.
- [ ] **Citation Engine**: Configure LlamaIndex to return source URLs in every chat response.
- [ ] **Query Logic**: Implement the strategy pattern to switch between Gemini and OpenRouter.

### Phase 4: FastAPI & Integration
- [ ] **API Development**: Create `/chat` endpoint with streaming support.
- [ ] **CORS Security**: Restrict API access only to the official frontend domain.
- [ ] **Frontend Widget**: Build the interactive Chat UI in React.

## ✅ Completed Tasks
- [x] Full purge of 2025 legacy data and obsolete Streamlit/FAISS files.
- [x] Implementation of double-layered `.gitignore` for root and backend.
- [x] Security verification for local credential protection.
- [x] Strategy alignment on Hybrid LLM and Vector Cloud providers.
