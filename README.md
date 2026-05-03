# LIFE Design Festival 2026 — Website

Sito web ufficiale del LIFE Design Festival 2026. Un'esperienza digitale interattiva e "editorial" progettata per riflettere l'identità fluida e dinamica del festival.

## 🚀 Architettura Tecnica

- **Core:** React 18 + TypeScript + Vite.
- **Styling:** Tailwind CSS con approccio "Rounded-none" e rigore geometrico.
- **Motion Engine:** 
  - **GSAP + ScrollTrigger**: Gestione di animazioni complesse e parallax sincronizzati.
  - **GSAP Ticker**: Utilizzato come heartbeat globale per garantire 60fps nelle interazioni ad alta frequenza.
- **Smooth Scroll:** Lenis per un'esperienza di navigazione fluida su tutti i dispositivi.

---

## 🎨 Feature Complesse & Sistemi Interattivi

### 1. Global Paint System (`src/components/paint/`)
Il sistema di disegno permette all'utente di "lasciare la propria traccia" su tutto il sito.
- **Dual Layer Canvas**: Utilizza due canvas sovrapposti. Uno statico per i tratti completati e uno temporaneo per il tratto in corso di disegno, ottimizzando i ricalcoli.
- **Coordinate Hybrid**: 
  - **Global View**: I tratti sono salvati con coordinate assolute (document-relative) per persistere durante lo scroll.
  - **Modal View**: Quando un modale è aperto, il sistema passa a coordinate viewport-relative, permettendo di disegnare sopra le schede degli speaker senza che lo scroll del sito influenzi il tratto.
- **Context API**: `PaintContext.tsx` gestisce lo stato dei tratti (strokes), il colore e la modalità (draw/nav), garantendo che le azioni di "Undo" e "Clear" siano sincronizzate ovunque.

### 2. Life25: Dynamic Image Trail (`src/components/Life25.tsx`)
Una sezione interattiva dove il movimento del mouse genera una scia di ricordi dell'edizione precedente.
- **Object Pooling**: Invece di creare/distruggere nodi DOM (costoso), il sistema pre-inizializza un pool di 15 elementi div/img che vengono riutilizzati ciclicamente.
- **Speed-Based Logic**: La dimensione, la rotazione e la velocità di comparsa delle immagini sono calcolate dinamicamente in base alla velocità del cursore (`Math.hypot`).
- **Z-Index Layering**: Le immagini passano *tra* le lettere del titolo (es. sopra la 'L' ma sotto la 'i'), creando un effetto di profondità tridimensionale.

### 3. Dual Timeline Program (`src/components/ProgramSection.tsx`)
Un programma eventi strutturato su due colonne (Day 5 / Day 6) con animazioni sincronizzate.
- **SVG Segment Growth**: Le linee della timeline crescono e cambiano colore dinamicamente durante lo scroll tramite ScrollTrigger.
- **Responsive Accordion**: Su mobile, le colonne diventano accordi animati con Framer Motion, mantenendo la sincronizzazione dei trigger GSAP tramite `ScrollTrigger.refresh()`.

---

## 🛠 Guida alla Manutenzione e Aggiornamento

Il sito è progettato con un approccio "Data-Driven": la logica è separata dai contenuti per permettere aggiornamenti rapidi senza toccare i componenti React.

### 1. Gestione Speaker (`src/data/speakersData.ts`)
Ogni oggetto speaker richiede:
- **`id`**: Identificativo univoco numerico. L'id `0` è riservato all'**Host** (layout speciale).
- **`image`**: Il file deve essere caricato in `public/assets/speakers/`. Formato consigliato `.jpg` o `.webp`, dimensione ~800x800px.
- **`color`**: Scegliere tra `primary`, `secondary`, `accent` per definire il colore del badge e dei dettagli nel modale.

### 2. Gestione Sponsor (`src/data/sponsorsData.ts`)
Gli sponsor sono divisi per gerarchia visiva. Il sistema supporta 6 categorie:
- **`main`**: Sponsor principali (Grid grande).
- **`experience` / **`active`**: Partner tecnici e di settore.
- **`partner`**: Logo wall standard (Grid fitta).
- **`community` / **`patron`**: Loghi istituzionali e partner media.
*Nota: I loghi devono essere preferibilmente SVG o PNG trasparenti caricati in `public/assets/logos/`.*

### 3. Aggiornamento Programma (`src/data/programData.ts`)
Il programma è mappato su una timeline a due colonne:
- **`day`**: Stringa identificativa (es. "5 GIU").
- **`type`**: Determina il colore del nodo sulla timeline (es. "Talk" = Rosa, "Workshop" = Blu). I colori sono mappati nel componente `ProgramSection.tsx`.
- **`time`**: Formato "HH:MM" per l'ordinamento visivo.

### 4. Ottimizzazione Asset per Performance
Per mantenere i parametri di fluidità definiti in `PROJECT_STATE.md`:
- **Immagini Life25**: Devono pesare tra **300KB e 600KB**. Se troppo pesanti, la GPU faticherà a renderizzare i 15 frame contemporanei durante il movimento veloce del mouse.
- **Webfont**: I font Aquawax e Automat sono caricati localmente in `public/fonts/` per eliminare il Cumulative Layout Shift (CLS).

---

## 📄 Documentazione di Controllo
- **`PROJECT_STATE.md`**: Tracciamento delle fasi di sviluppo, task completate e parametri tecnici di performance (Fluidity Rules).

---
*Progetto curato per LIFE Design Festival 2026.*
