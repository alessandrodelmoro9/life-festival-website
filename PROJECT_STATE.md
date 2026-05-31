# Stato Progetto - LIFE Design Festival 2026 - FINAL SPRINT & RELEASE

## 🎯 Obiettivo Consegna
Sistema RAG professionale pronto per il deploy finale. Interfaccia "Magazine Style" certificata, logica deterministica per gli asset e backend blindato per la produzione su Render (Free Tier).

---

## 🔐 Protocollo Sicurezza & Gestione Segreti (.env)

### 1. Audit dei Segreti
- **Zero Leak Policy:** Nessuna API Key (OpenAI, Gemini, Qdrant) deve essere scritta nel codice.
- **Environment Variables:**
  - **Vercel (Frontend):** Configurare `VITE_BACKEND_URL` (punterà a Render in prod, a localhost in dev).
  - **Render (Backend):** Configurare `OPENAI_API_KEY`, `GEMINI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `CORS_ALLOWED_ORIGINS`.
- **.gitignore Check:** Verificare che tutti i file `.env`, `.venv/`, `__pycache__/` e log locali siano rigorosamente esclusi prima del primo push di origin per il backend.

### 2. Sanificazione Codebase
- **Frontend:** Rimozione sistematica di `console.log`, `console.warn` e commenti di debug che rivelano la struttura del backend.
- **Backend:** Disabilitazione della documentazione automatica di FastAPI (`/docs`, `/redoc`) in produzione per evitare l'esposizione degli endpoint.
- **Data Privacy:** Implementazione del layer di mascheramento dati (P.I.I. Stripping) per proteggere la privacy degli utenti nelle chat.

---

## 🛠 Piano di Produzione (Roadmap Domani)

### 1. Branch Strategy & Codebase Cleanup
- **Branch Corrente:** `backend-setup` (Stabile, solo commit locali).
- **Nuovo Branch:** `production-ready` (Target per il primo push su Origin).
- **Refactoring Architetturale (Target):**
  - `src/components/sections/`: Hero, About, Program, Speakers, Sponsor, Location, Tickets.
  - `src/components/features/`: ChatWidget, PaintCanvas.
  - `src/components/ui/`: Componenti atomici (Shadcn/UI).
- **Eliminazione Detriti:** 
  - Backend: `mega_stress_test.py`, `stress_test_assets.py`, `tutti_i_talks.md`.
  - Root: `DRIVE_IMPORT.txt`, `pixel-script.txt`, `CHAT_DEBUG.md`.

### 2. Ottimizzazione Render (Free Tier)
- **Keep-Alive logic:** Il frontend effettuerà un `ping` silente al backend all'atterraggio dell'utente per ridurre la latenza del "cold start" di Render.

### 3. Last Minute Content & Assets
- **Knowledge Base:** Predisposizione file per Afterparty e Organizzatori.
- **Asset Normalization:** Rinomina file in `kebab-case` per compatibilità cross-platform.

---

## 🚀 Strategia di Deploy
1. **GitHub First Push:** Push del branch `production-ready` dopo l'audit di sicurezza.
2. **Setup Render:** Creazione Web Service collegato alla cartella `/backend` del branch `main` (post-merge).
3. **Vercel Preview:** Test del team tramite link di preview generato da Vercel.

*Ultimo aggiornamento: Domenica 31 Maggio 2026, ore 01:45 - Status: Security Protocol Defined & Ready for Refactoring*
