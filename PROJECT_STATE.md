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
- **UI/UX**: Floating/Draggable Chat Widget with "Rich Cards" support for speakers/sponsors.

## 🚀 Roadmap & Tasks

### 🔴 URGENT: Tonight's Task (May 19, 23:30)
- [ ] **Remove SocialProofWidget**: 
  - Delete `import SocialProofWidget` from `src/App.tsx`.
  - Delete `<SocialProofWidget />` from the JSX in `src/App.tsx`.
  - Push to `main` to trigger Vercel deploy.

### Phase 0: Preparation & Demo Analysis (Current)
- [ ] **Repository Cleanup**: Delete local branches except `main`.
- [ ] **Monorepo Setup**: Create `feature/backend-setup` branch and `backend/` directory.
- [ ] **Demo Migration**: User to copy existing demo codebase into the `backend/` folder.
- [ ] **Codebase Review**: Analyze the demo logic to finalize the RAG engine and data structure.

### Phase 1: Knowledge Base & Ingestion
- [ ] Structure Markdown and JSON data for speakers, program, and vision.
- [ ] Develop the ingestion pipeline to populate Qdrant Cloud.
- [ ] Implement rich metadata support (returning image URLs and card data).

### Phase 2: Python Backend Development
- [ ] Setup FastAPI boilerplate with professional directory structure.
- [ ] Implement the **Strategy Pattern** for Gemini/OpenRouter switching.
- [ ] Create the RAG Query Engine (LlamaIndex/LangChain).
- [ ] Implement Unit Tests for retrieval and API endpoints.

### Phase 3: Frontend Integration
- [ ] Create `ChatWidget.tsx` using `framer-motion` (Draggable).
- [ ] Connect Frontend to Backend via `fetch` using environment variables.
- [ ] Implement "Rich Card" rendering in the chat UI.

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
