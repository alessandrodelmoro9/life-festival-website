# Life Design Festival 2026

Il sito ufficiale della seconda edizione del Life Design Festival a Potenza (5-6 Giugno 2026).

## Caratteristiche Tecniche
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion + GSAP
- **Infrastruttura**: Vercel (SPA routing & 301 Redirects)
- **Legal**: Iubenda Cookie Solution with Prior Blocking
- **SEO**: Full Meta Tag Suite, Schema.org Event Data, AI-ready (`llms.txt`)

## Struttura SEO & AI
Il progetto segue il "Gold Standard" della SEO tecnica:
- **H1 Unico**: "Life Design Festival" nella Hero Section.
- **Gerarchia Semantica**: Utilizzo di tag `H2` per le sezioni, ma con classi `.text-h1` per mantenere l'impatto visivo di 120px. Questo scollega la semantica (per Google) dallo stile (per il design).
- **Metadata**: Configurazione avanzata per Google Discover e Social Cards.
- **AI Context**: Il file `public/llms.txt` fornisce un contesto strutturato per i Large Language Models (LLM).

## Guida al Deploy e Manutenzione

### Modifica Contenuti
I dati dinamici del sito sono centralizzati nella cartella `src/data/`:
- `programData.ts`: Modifica orari e attività.
- `speakersData.ts`: Aggiorna biografie e profili social degli ospiti.
- `sponsorsData.ts`: Gestione dei loghi e categorie sponsor.

### Deploy su Vercel
Ogni push sul branch `main` attiva automaticamente un deploy in produzione.
1. Apportare le modifiche locali.
2. `git add .`
3. `git commit -m "Update: [descrizione modifica]"`
4. `git push origin main`

### Legal & Cookie
Per aggiornare la configurazione legale:
- Lo script di Iubenda si trova in `index.html`.
- Se si aggiungono nuovi script di terze parti (es. Analytics), ricordarsi di applicare il "Prior Blocking" usando `type="text/plain"` e `class="_iub_cs_activate"`.

---
© 2026 Life Design Festival. Made with love & an AI agent swarm.
