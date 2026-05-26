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

### Giorni 5-6: UI Development & Integration (COMPLETATO)
- [x] **React Widget**: Sviluppo componente ChatWidget (Draggable Bar + Full Page Conversation).
- [x] **Cursor Management**: Risolto conflitto z-index e sparizione cursore custom su elementi UI.
- [x] **Backend Logic Refactor**: Implementato `PromptTemplate` rigido e aumentato `top_k=8` per maggiore precisione.
- [x] **Entity Linking**: Creato `00_GLOBAL_SUMMARY.md` per mappare correttamente Relatori -> Studi -> Orari.

### Giorni 7-8: Testing & Produzione (IN CORSO)
- [x] **Validation**: Test risposte bot (Verificato: estrazione immagini e orari funzionante).
- [ ] **Quota Management**: Risoluzione blocchi 429/402 (In attesa di crediti OpenRouter o reset Google).
- [ ] **Deployment**: Caricamento backend su Render.com e configurazione DNS.

## ✅ Task Completati
- [x] **Knowledge Base Ingestion**: 164 nodi indicizzati su Qdrant Cloud.
- [x] **Failover Strategy**: Implementazione fallback su OpenRouter/DeepSeek.
- [x] **Backend Stability**: Downgrade `qdrant-client` a `1.12.0` (Risolto AttributeError).
- [x] **RAG Precision**: Passaggio a sistema di Prompt Template e Summary Globale.

## 🔴 Blocchi Attuali & Debug Necessario
1. **API Quota (CRITICO)**: Le chiavi Google Free Tier raggiungono il limite dopo pochi messaggi.
2. **OpenRouter Credits**: Richiesta ricarica crediti per attivare il fallback stabile su DeepSeek.

## 📝 Note per la Ripresa
- Il file `backend/knowledge/00_GLOBAL_SUMMARY.md` deve essere re-indicizzato al prossimo avvio con chiavi cariche.
- Il modello predefinito è ora `gemini-flash-latest` per massimizzare la quota disponibile.
