# PROJECT STATE - LIFE Design Festival 2026 Chatbot

## 🚀 Architettura RAG: ID-Centric & Registry-First
Abbiamo implementato una logica deterministica per garantire precisione chirurgica nel recupero di asset e link, superando i limiti della sola ricerca semantica.

### 1. Il "Bussola" (Registry Nodes)
Ogni categoria (Sponsor, Speaker, Programma) ha un nodo **Registry** (`id: global-partners`, `id: registry-speakers`, ecc.).
- **Injection Mandatoria**: Quando il sistema rileva un intento, inietta il riferimento al registro nel prompt dell'LLM.
- **Link Harvesting**: Il sistema scansiona il testo del registro per estrarre tutti i link URL, garantendo che i bottoni appaiano anche se l'LLM non li scrive.

### 2. Il "Mappa" (Entity Chunks)
I singoli speaker e sponsor hanno chunk dedicati con metadati ricchi (`id`, `type`, `web`, `img`, `date`, `time`).
- **Ponte via ID**: Il sistema usa gli ID `[[REF:id]]` citati dall'LLM per pescare l'immagine e il link esatto dal chunk corrispondente.

### 3. Logica di Visualizzazione (Magazine Style)
- **Broad Queries (Tutti gli sponsor, Programma totale, Singola mattina)**:
  - Visualizza **SOLO** le immagini composite (Gallery / Sponsor Wall).
  - Nasconde le immagini singole per mantenere il design pulito.
- **Specific Queries (Workshop, Biglietti, "Chi è X")**:
  - Visualizza le **Immagini Singole** delle persone coinvolte.
  - Priorità ai link specifici dell'entità.
- **Timeframe Match**: Per richieste come "Venerdì mattina", il sistema incrocia i metadati temporali dei chunk per raccogliere tutti i link degli speaker di quella fascia oraria.

### 4. Constraints Visivi & Branding
- **Colori**: Sfondo crema (`#F4EEE4`), testo nero (`#1A1A1A`), hover rosa (`#FF66CC`).
- **No Emoji / No Tabelle**: Formattazione pulita stile editoriale.
- **Link Bottoni**: Tutti i link web sono estratti e mostrati come bottoni sotto la chat, mai nel testo.

## 🛠️ Stato attuale
- [DONE] Logica ID-Centric implementata in `engine.py`.
- [DONE] Asset composite aggiornati per correggere refusi.
- [DONE] Filtro esclusivo per Gallery vs Immagini singole.
- [DONE] Recupero link massivo da registri.
- [IN PROGRESS] Testing finale su casi limite di intenti misti.
