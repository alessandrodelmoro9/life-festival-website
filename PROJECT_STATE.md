# Project State - Life Design Festival 2026

## 🎯 Overall Goal
Finalize the Life Design Festival 2026 website and implement a high-performance RAG Chatbot with a hybrid Python backend to assist visitors.

## 🛠️ Active Constraints & Standards
- **Backend Architecture**: FastAPI (Asynchronous), Pydantic for validation, Clean Architecture.
- **AI Stack (Hybrid Cloud Strategy)**:
  - **Framework**: LlamaIndex (Primary) or LangChain (to be finalized after demo review).
  - **Vector DB**: Qdrant Cloud (Free Tier - Serverless).
  - **LLM Strategy**: Google Gemini 1.5 Flash (Primary Free Tier) + OpenRouter (Prepaid Fallback: DeepSeek/GPT-4o-mini).
  - **Knowledge Base**: Hybrid approach using Markdown (Semantic search) and JSON (Structured metadata for images/links).
- **Hosting & Infrastructure**:
  - **Frontend**: Vercel.
  - **Backend**: Render.com (Free Tier) + `cron-job.org` (to prevent sleep).
  - **Repository**: Monorepo structure (Frontend + Backend).
- **Security**: CORS restriction to production domain, API Rate Limiting, secure .env management.
- **UI/UX**: 
  - **Desktop**: Pill-shaped/Industrial box (inspired by `PaintToolbar`) with semi-transparent blur and `Automat Grotesk` typography. Expands upwards upon input.
  - **Mobile**: Small draggable/floating button triggering a clean fullscreen overlay or bottom drawer.
  - **Interactivity**: Real-time text streaming and embedded media support.

- **Economic Plan (Zero-Cost Strategy)**:
  - **LLM**: Primary use of Google Gemini 1.5 Flash (Free Tier) + OpenRouter (Prepaid credits for DeepSeek/GPT-4o-mini as low-cost fallback).
  - **Vector DB**: Qdrant Cloud (Free Tier - Serverless, 1GB storage).
  - **Hosting**: Render.com (Free Tier) + `cron-job.org` for keep-alive.
  - **Embeddings**: Evaluate `text-embedding-004` (Gemini Free) vs. HuggingFace Free Inference API.

## 🚀 Roadmap & Tasks

### 🔴 URGENT: Frontend Maintenance (Separate Branch)
- [ ] **Remove SocialProofWidget**: Dedicated branch `fix/remove-social-proof`.

### Phase 0: Knowledge Base Enrichment & Deep Research (CURRENT FOCUS)
- [ ] **Comprehensive Deep Search**: Speakers, Press, Potenza, and "TRACCIA" philosophy.
- [ ] **RAG Engine Research**:
  - **Chunking Strategy**: Semantic chunking vs. Fixed-size with overlap.
  - **Prompt Engineering**: System prompts for "Industrial/Professional" tone and citation handling.
  - **Verification**: Cross-reference all data with the original `Line up` file for truthfulness.

### Phase 1: Technical Foundation & Demo Adaptation
- [ ] **Demo Analysis & Cleanup**: Analyze the existing "Demo Base" for reusable patterns.
- [ ] **Technical Implementation**: Finalize `requirements.txt`, `ingest.py`, and Docker configuration.
- [ ] **Qdrant Setup**: Initialize cloud collection and test vector ingestion.

### Phase 2: Python Backend Development
- [ ] Setup FastAPI boilerplate with professional directory structure.
- [ ] Implement the **Strategy Pattern** for Gemini/OpenRouter switching.
- [ ] Create the RAG Query Engine (LlamaIndex).
- [ ] Implement Unit Tests for retrieval and API endpoints.

### Phase 3: Frontend Integration
- [ ] Create `ChatWidget.tsx` using `framer-motion` (Draggable).
- [ ] Connect Frontend to Backend via `fetch`.
- [ ] Implement "Rich Card" rendering for speakers/sponsors.

### Phase 4: Infrastructure & Deployment
- [ ] Dockerize the Python Backend.
- [ ] Deploy to Render.com and setup `cron-job.org` pings.
- [ ] Configure DNS/CORS for the production API.

## ✅ Completed Tasks
1. **Frontend Micro-fixes**: Capitalized Hero title, fixed mobile letter spacing, renamed Exposition to Exhibitions.
2. **SEO & Accessibility**: Validated heading hierarchy and meta tags.
3. **Typography Refinement**: Standardized About, Tickets, and Speaker Modal typography.
4. **Integration**: Meta Pixel fully integrated.
5. **Domain**: `lifedesignfestival.it` is live on Vercel.

## 📝 Personal Notes
The backend will be a "Master's level" showcase of engineering: monorepo, hybrid LLM providers, and optimized RAG with visual widget support.
