# Project State - Life Design Festival 2026

## 🎯 Overall Goal
Finalize the Life Design Festival 2026 website and implement a high-performance RAG Chatbot with a hybrid Python backend (Cloud/Local RTX 5090) to assist visitors.

## 🛠️ Active Constraints & Standards
- **Backend Architecture**: FastAPI (Asynchronous), Pydantic for validation, Clean Architecture.
- **AI Stack**: LlamaIndex/LangChain, Vector DB (ChromaDB/Qdrant), Hybrid LLM (DeepSeek Cloud / Local vLLM-Ollama).
- **Hybrid Hosting**: Vercel (Frontend) + Render (Cloud Backend) + Cloudflare Tunnel (Local RTX 5090 Backend).
- **Security**: CORS restriction to production domain, API Rate Limiting, secure .env management.
- **UI/UX**: Floating/Draggable Chat Widget with collision avoidance (Paint System).

## 🚀 Roadmap & Tasks

### Phase 1: Knowledge Base (Data Engineering)
- [ ] Create structured Markdown files (`speakers.md`, `programma.md`, `vision.md`, etc.) with rich metadata (images, links).
- [ ] Develop a Python Ingestion Script to parse and clean data.
- [ ] Implement a Vector Indexing pipeline (Embeddings generation).

### Phase 2: Python Backend Development (The "Jewel")
- [ ] Setup FastAPI boilerplate with professional directory structure.
- [ ] Implement the **Strategy Pattern** for Cloud/Local LLM switching.
- [ ] Create the RAG Query Engine (Context retrieval + LLM synthesis).
- [ ] Add Rich Metadata support (returning image URLs and links in JSON).
- [ ] Implement Unit Tests for retrieval and API endpoints.

### Phase 3: Frontend Integration
- [ ] Create `ChatWidget.tsx` using `framer-motion` (Draggable).
- [ ] Implement collision logic with `PaintToolbar.tsx`.
- [ ] Connect Frontend to Backend via `fetch` using environment variables.
- [ ] Render "Rich Cards" (Speaker/Sponsor) in the chat UI.

### Phase 4: Infrastructure & Deployment
- [ ] Dockerize the Python Backend.
- [ ] Deploy Cloud version to Render.
- [ ] Setup Cloudflare Tunnel for local RTX 5090 testing.
- [ ] Configure DNS for `api.lifedesignfestival.it`.

## ✅ Completed Tasks
1. **SEO & Accessibility**: Validated heading hierarchy and meta tags.
2. **Typography Refinement**: Standardized About, Tickets, and Speaker Modal typography.
3. **Bug Fixes**: Resolved Mac/Safari hover flickering and Vercel build errors.
4. **Integration**: Meta Pixel fully integrated.
5. **UI Stabilization**: Hero button size fixed.
6. **Domain**: `lifedesignfestival.it` is live on Vercel.

## 📝 Personal Notes
The backend is planned to be a "Master's level" showcase of Python engineering. The focus is on clean architecture, hybrid scalability, and the RAG pipeline efficiency.
