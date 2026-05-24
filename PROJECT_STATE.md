# Project State - Life Design Festival 2026

## 🎯 Overall Goal
Implement a high-performance, production-grade RAG Chatbot for the Life Design Festival 2026, using LlamaIndex/Qdrant Cloud, featuring an "AI Curator" persona and a draggable-to-fullscreen React interface.

## 🛠️ Active Constraints & Standards
- **UI Desktop Flow**: Draggable input bar at `bottom-8 right-8` (z-index 10005). On submit, transitions to fixed fullscreen portal (z-index 10010).
- **UI Mobile Flow**: Floating button at `bottom-24 right-6`.
- **Backend Stability**: Requires `prefer_grpc=False` and explicit version alignment for `qdrant-client`.
- **Visuals**: Custom cursor must remain visible (z-index 99999) and system cursor must be hidden via global CSS (`!important`).
- **Data**: Ingestion is complete (164 nodes indexed in Qdrant Cloud).

## 🚀 Roadmap Operativa

### Giorni 1-4: KB, Ingestion & Backend Core (COMPLETATO)
- [x] **Data Ingestion**: Caricamento di 164 nodi su Qdrant Cloud con metadati e link.
- [x] **Backend Logic**: Implementazione Failover (Gemini -> DeepSeek) e gestione connessione Qdrant.
- [x] **Modelli**: Verificata disponibilità Gemini 2.0 Flash e Embedding-001.

### Giorni 5-6: UI Development & Integration (IN CORSO)
- [x] **React Widget**: Sviluppo componente ChatWidget (Draggable Bar + Full Page Conversation).
- [x] **Cursor Management**: Risolto conflitto z-index e sparizione cursore custom su elementi UI.
- [ ] **DEBUG CRITICO**: Risoluzione `AttributeError: 'QdrantClient' object has no attribute 'search'`.

### Giorni 7-8: Testing & Produzione (TODO)
- [ ] **Validation**: Test risposte bot con recupero immagini `/assets/` e link.
- [ ] **Deployment**: Caricamento backend su Render.com e configurazione DNS.

## ✅ Task Completati
- [x] **Knowledge Base Ingestion**: 164 nodi indicizzati con successo.
- [x] **Failover Strategy**: Implementazione fallback su OpenRouter/DeepSeek.
- [x] **UI Prototype**: Widget funzionante con animazioni Framer Motion.
- [x] **Cursor Fix**: Z-index 99999 e soppressione globale del cursore di sistema.

## 🔴 Blocchi Attuali & Debug Necessario (Per la prossima sessione)
1. **Qdrant Version Mismatch**: Nonostante il downgrade a `1.10.1`, il backend riporta ancora la mancanza del metodo `search`. 
   - *Ipotesi*: Possibile conflitto con `llama-index-vector-stores-qdrant` che richiede una versione specifica o installazione di pacchetti "ombra".
   - *Azione*: Pulire `.venv` e reinstallare le dipendenze in modo isolato.
2. **Cursor Visibility**: Verificare se su alcuni browser il cursore sparisce ancora a causa di `iframe` o altri elementi fixed.

## 📝 Note per la Ripresa
- Il backend è configurato per puntare a Qdrant Cloud (AWS Frankfurt).
- Le chiavi sono in `backend/.env`.
- Il frontend si aspetta il backend su `http://localhost:8000`.
