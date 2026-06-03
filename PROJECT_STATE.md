# PROJECT STATE - LIFE Design Festival 2026 Chatbot

## 🚀 Status: PRODUCTION READY
L'ecosistema AI è stato consolidato, testato e messo in sicurezza per il rilascio pubblico. La logica di recupero è passata da una ricerca puramente semantica a un'architettura **Registry-First** deterministica.

### 1. Traguardi Raggiunti (Maggio-Giugno 2026)
- **Stabilità Titanium**: Il motore RAG gestisce query nulle o fallimenti del database senza crash (NoneType-safe).
- **Link Harvesting 100%**: I link di Speaker, Sponsor e Social sono estratti dai registri statici caricati in memoria all'avvio.
- **Visual Intelligence**: Gestione intelligente di Composite Gallery (per date/orari) e Single Portraits (per workshop/speaker).
- **Inclusività**: Implementazione sistematica della Schwa (ə) in tutte le risposte del Curatore.

### 2. Hardening Tecnico
- **Backend**: FastAPI con Rate Limiting (SlowAPI) e supporto per Linux (Render compatibile).
- **Frontend**: URL API dinamico tramite `VITE_API_URL` per switch istantaneo Locale -> Produzione.
- **Sicurezza**: Protezione totale delle chiavi API tramite `.gitignore` e iniezione ambientale.

## 🚀 Pipeline di Deployment Online

### Fase 1: RENDER (Backend)
1.  **Web Service**: Creare un nuovo Web Service collegato al repo GitHub.
2.  **Configurazione**: 
    - Root: `backend`
    - Build: `pip install -r requirements.txt`
    - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3.  **Environment**: Inserire `QDRANT_URL`, `QDRANT_API_KEY`, `OPENROUTER_API_KEY`.

### Fase 2: VERCEL (Frontend)
1.  **Project Import**: Importare il repository principale.
2.  **Environment**: Aggiungere `VITE_API_URL` con l'URL fornito da Render.
3.  **Build**: Preset `Vite`.

### Fase 3: KEEP-ALIVE
- Configurare un Job esterno su **Cron-job.org** ogni 14 minuti verso l'URL di Render per prevenire lo sleep del piano free.

---

## 📝 Note per il Cliente
Il sistema è progettato per auto-aggiornarsi: ogni modifica ai file Markdown nella cartella `/knowledge` viene recepita al prossimo riavvio del server o re-ingestione, garantendo una manutenzione minima e un'alta affidabilità delle informazioni.
