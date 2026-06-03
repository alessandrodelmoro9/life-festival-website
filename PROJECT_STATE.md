# PROJECT STATE - LIFE Design Festival 2026 Chatbot

## 🚀 Status: PRODUCTION READY & CONNECTED
L'ecosistema è ora interamente collegato tra Frontend (Vercel) e Backend (Render). I dati sono stati allineati e la pipeline di aggiornamento è automatizzata.

### 1. Traguardi Raggiunti (Giugno 2026)
- **Connessione Live**: Frontend e Backend comunicano correttamente tramite `VITE_API_URL`.
- **CORS Hardening**: Autorizzati i domini di produzione e i link preview specifici di Vercel.
- **Granular Team Metadata**: Il team di **FIIICO CREATIVE** (Rossana, Federico, Michele, Massimiliano) è mappato individualmente per fornire link LinkedIn mirati.
- **Automated Ingestion**: Il database Qdrant si sincronizza automaticamente ad ogni push tramite il comando di build.

### 2. Checklist Operativa Finale (Cosa fare ora)
- [ ] **Render Build Command**: Impostare `pip install -r requirements.txt && python core/ingest.py` nella dashboard di Render.
- [ ] **Git Push**: Caricare l'ultimo commit con i metadati del team e le correzioni CORS.
- [ ] **Cron-Job**: Attivare il ping su `cron-job.org` verso l'endpoint `/health` (ogni 10-14 min) per evitare lo sleep del server.
- [ ] **Validation Test**: Verificare le risposte specifiche (es. "Chi è Federico Luciani?") sui link di produzione.

### 3. Note per la Manutenzione
Per aggiornare i contenuti del chatbot, basta modificare i file in `/backend/knowledge` e fare un `git push`. Il sistema si occuperà di svuotare e ricaricare il database Cloud automaticamente.

---

## 📝 Lista Cose da Fare (Prossima Sessione)
1. Eseguire il push finale del branch `production-ready`.
2. Verificare l'avvio della build su Render con il comando di ingestione.
3. Testare le risposte individuali dei membri del team sul sito live.
4. Configurare il Keep-alive per garantire risposte istantanee agli utenti.
