# Stato Progetto - LIFE Design Festival 2026 - FINAL SPRINT

## 🎯 Obiettivo Consegna
Consegnare un sistema RAG professionale, visivamente integrato e documentato accademicamente per il master, pronto per il deploy su Render (Free Tier).

---

## 🎨 Design & Branding (Richieste inviate al Team LIFE)
Abbiamo formalizzato le richieste al team grafico per finalizzare l'interfaccia:
- [ ] **UI Chat Full-Page**: Revisione del design dell'interfaccia chat (bolle, gradienti, micro-interazioni, uso corretto dei pesi di Automat Grotesk di Zetafonts).
- [ ] **Widget & Toggle Mobile**: Creazione design per il bottone flottante da mobile e validazione del widget desktop (forma a pillola).
- [ ] **Asset Visivi "Collettivi"**: Creazione di 3 immagini "composite" per gestire le liste lunghe senza intasare la chat:
    - 1 immagine con tutti i loghi dei Partner/Sponsor.
    - 1 immagine con tutti gli Speaker della Mattina.
    - 1 immagine con tutti gli Speaker del Pomeriggio.
- [ ] **Knowledge Base Audit**: Revisione finale dei 4 file `.md` (`speaker-talk.md`, `partner-sponsor.md`, `programma-logistica.md`, `visione-concept.md`) per fact-checking.

---

## 🛠️ Hardening Tecnico (Logic & Deploy)
- [ ] **RAG Logic Perfection**:
    - Hardening parser `[[REF:id]]` per garantire l'estrazione di *tutti* i metadati nelle liste lunghe.
    - Debug cliccabilità link (es. Eventbrite) nel widget React.
- [ ] **Code Cleaning**: Rimozione log di debug, pulizia del codice e refactoring per renderlo professionale e pronto per la revisione dei docenti.
- [ ] **Render.com Setup & DNS**:
    - Configurazione del piano Free.
    - Implementazione di uno script "Keep-Alive/Warm-up" per gestire il risveglio dal freeze dei 14 minuti di inattività di Render.
    - Piano per DNS e futura scalabilità/espansione della Knowledge Base.

---

## 📚 Documentazione & Accademia
- [ ] **README.md Professionale**: Stesura di una documentazione impeccabile con:
    - Diagramma dell'architettura RAG.
    - Setup environment.
    - Dettaglio sul sistema di "Atomic Metadata Injection" e Entity Linking.
- [ ] **Mail ai Professori**: Preparazione della mail tecnica per presentare il progetto e fornire il branch di prova del backend per una revisione last-minute.

---

## 🚀 Prossimi Passi (Domani)
1. Esecuzione del **Code Cleaning** su backend e frontend.
2. Fix dei bug UI (Link Eventbrite) e RAG (Parser immagini multiple).
3. Stesura del `README.md` e della bozza per i professori.
4. Attesa feedback dal team LIFE per l'integrazione degli asset grafici.

---
*Ultimo aggiornamento: Venerdì 29 Maggio 2026 - Fine Sessione*
