# LIFE Design Festival 2026 - Project State

## 🟢 COMPLETATO (Backend & Knowledge Base)
*   **Knowledge Base**: Rinominati i file in modo semantico. Inseriti blocchi JSON `> **METADATA**:` per un'estrazione precisa di link e foto per speaker e sponsor.
*   **Gestione Dipendenze**: Risolti i conflitti tra le vecchie librerie LlamaIndex e OpenRouter. Siamo passati a una configurazione stabile usando `OpenAILike` con la versione 0.14+ di LlamaIndex.
*   **Motore RAG (`engine.py`)**:
    *   Integrato **Gemini 2.0 Flash** (LLM) e **text-embedding-3-small** (Embedding) tramite OpenRouter.
    *   Aggiunta memoria conversazionale asincrona (`ChatMemoryBuffer` a 8000 token per evitare crash).
    *   Aumentato il raggio di ricerca (`similarity_top_k=12`) per trovare i metadati dei sotto-nodi.
*   **Database Vectoriale (Qdrant)**:
    *   Risolto l'errore di timeout creando un sistema di Ingestion a "piccoli batch" (10 alla volta).
    *   Ricreata la collezione per combaciare con le dimensioni corrette dei vettori (1536).
*   **API & Sicurezza (`main.py`)**: 
    *   Server FastAPI configurato con Rate Limiting (10 req/min) tramite `slowapi`.
    *   CORS aggiornato per includere `http://localhost:8080` e i domini di produzione.

## 🟡 DA FARE (Il Prossimo Step Logico)
*   **Raffinamento Estrazione Metadati (`engine.py`)**: 
    *   *Problema attuale*: Il RAG recupera correttamente i dati (testato con successo), ma la funzione `query` inserisce nella risposta *tutti* i link/immagini trovati nei 12 nodi sorgente, anche quelli non pertinenti alla domanda specifica.
    *   *Soluzione pianificata*: Creare un filtro "intelligente" in `engine.py` che verifichi se il link/immagine è effettivamente menzionato nel testo della risposta finale prima di inviarlo al frontend.
*   **Frontend UI (`ChatWidget.tsx`)**:
    *   Garantire che il frontend legga correttamente gli array `images` e `links` provenienti dalla nuova API e li renderizzi come card interattive.
*   **Deploy su Render & Vercel**:
    *   Deploy del backend FastAPI su Render.
    *   Deploy del frontend React aggiornato su Vercel.

## 📝 NOTE TECNICHE (Memo per il futuro)
*   **Non modificare la Knowledge Base**: I test granulari hanno confermato che i dati ci sono e sono scritti bene. Il problema della location o dei troppi link è un problema di "tuning" del RAG, non dei documenti markdown.
*   **Comando di test**: Usare `python test_system.py` per verificare il comportamento del bot simulando chiamate API reali con pause per il rate limiting.
