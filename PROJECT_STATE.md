# PROJECT STATE - LIFE Design Festival 2026 Chatbot

## 🚀 Status: LIVE & FULLY AUTOMATED
Il sistema è operativo, testato e sincronizzato. La connessione Vercel-Render è stabile e il database Qdrant è stato ripulito e allineato ai contenuti finali.

### 1. Traguardi Raggiunti (GIUGNO 2026)
- **Automazione Totale**: Ingestione automatica dei dati ad ogni push tramite il comando di build su Render.
- **Granularità Team**: Risposte mirate per i singoli membri di **FIIICO CREATIVE** con bottoni LinkedIn individuali.
- **Zero Latency**: Configurato Cron-job esterno per prevenire lo sleep del server Render.
- **CORS Hardening**: Accesso sicuro garantito per i domini ufficiali e preview.

### 2. 🏁 ROADMAP PER IL LANCIO UFFICIALE (GO-LIVE)
Quando sarete pronti per il lancio pubblico sul dominio principale, seguite questi step:

1. **Merge su `main`**: Unire il branch `production-ready` nel branch `main` di GitHub.
2. **Switch Render/Vercel**: 
   - Su Render: Cambiare il branch di monitoraggio da `production-ready` a `main`.
   - Su Vercel: Assicurarsi che il dominio ufficiale punti al branch `main`.
3. **OpenRouter Credits**: 
   - Attualmente l'API Key ha un limite di 20€ (con circa 2.50€ già consumati).
   - Per il festival, si consiglia di ricaricare il credito su OpenRouter per evitare interruzioni durante i giorni di picco.
4. **Nuova API Key (Opzionale)**: Creare una chiave dedicata esclusivamente alla produzione per monitorare i costi separatamente dai test.

### 3. ISTRUZIONI PER LA MANUTENZIONE
- **Aggiornamento Testi**: Modificare i file in `backend/knowledge/` -> `git push`. L'AI imparerà tutto in 3 minuti.
- **Monitoraggio**: Controllare periodicamente la dashboard di `cron-job.org` per assicurarsi che il server sia sempre attivo.

---

## 📝 Note Finali
Il progetto è stato consegnato con un'architettura **Registry-First** che garantisce risposte deterministiche e link sempre corretti, eliminando le allucinazioni tipiche delle AI standard.

