# 🚀 LIFE DESIGN FESTIVAL 2026 - Project State & Roadmap

Questo documento serve come **memoria permanente** per lo stato dello sviluppo. Leggere attentamente prima di procedere.

---

## 📅 Stato Attuale (15 Aprile 2026)
- **Branch Attivo:** `feature/interactive-about`
- **Obiettivo:** Creare un sito web premium, editoriale e interattivo basato sul concetto di "tracce" e "nodi".
- **Design:** Minimalista, ampi spazi bianchi, animazioni GSAP fluide, tipografia Aquawax (Display) e Automat (Body).

---

## 🏗️ Codebase Status (Meticoloso)

### 1. Hero & Navigation
- **Navbar:** Sticky, ottimizzata per mobile, con link Eventbrite e navigazione interna (#sponsors).
- **HeroSection:** Animazione SplitText per il titolo, traccia SVG dinamica (opacità 20%).

### 2. Countdown Section (`src/components/Countdown.tsx`)
- **Logica:** Count-up veloce (2.5s) all'ingresso, poi timer reale.
- **Interattività:** Effetto magnetico 3D con ombra profonda on hover.
- **Mobile:** Forzato su una singola riga (`flex-nowrap`) con font size ridotto per compatibilità Oppo/schermi stretti.
- **Visual:** Linea SVG "respirante" e quadratini colorati fluttuanti.

### 3. About Section (`src/components/AboutSection.tsx`) - **IN SVILUPPO**
- **Restyling Testuale:** Titolo "Progetta il tuo futuro. Lascia tracce indelebili." + paragrafi evocativi.
- **Trigger Interattivo:** 
    - Posizionato alla destra del titolo (Desktop).
    - Composto da label "Lasciaci un segno" + Freccia SVG curva diagonale (alto-sinistra -> basso-destra) + Quadratino Azzurro (`#0070f3`) pulsante.
    - La freccia è un unico path per un'intersezione perfetta. Il quadratino è distanziato per non toccare la punta durante il "bounce".
- **Desktop:** Linea SVG orizzontale rimossa per pulizia editoriale.
- **Mobile:** Layout verticale con linea di separazione minima.

### 4. Speakers Section (`src/components/SpeakersSection.tsx`)
- **Marquee:** Doppia riga infinita GSAP.
- **Performance:** Ottimizzata con `force3D: true` e `will-change: transform` per eliminare il lag su mobile (testato su Oppo).
- **Interattività:** Rallentamento (timeScale 0.1) on hover.

### 5. Sponsor Section (`src/components/SponsorSection.tsx`)
- **Layout:** Binari editoriali con bordi sottili.
- **Loghi:** Grayscale (70% opacity) che tornano a colori on hover.
- **Data-Driven:** Contenuti centralizzati in `src/data/sponsorsData.ts`.

---

## 🛠️ Roadmap & Prossimi Passi (Priorità Alta)

### 1. Sistema "Paint" (Disegno Interattivo)
- **Attivazione:** Deve essere triggerato dal tasto in `AboutSection`.
- **Funzionalità:**
    - **Canvas Globale:** Un layer sopra tutto il sito dove l'utente può disegnare.
    - **Cursor Trail:** Scia fluida che segue il mouse/tocco.
    - **Disegno:** Tasto destro (Desktop) o Tocco prolungato/trascinamento (Mobile).
    - **Colori:** Tratti che usano la palette del festival (Blue, Pink, Red).

### 2. Archive 2025
- Creazione di una sezione "esperienziale" per le foto dell'edizione passata.
- Layout a griglia irregolare (stile collage editoriale).

### 3. Cleanup & Polishing
- Rimozione componenti `shadcn/ui` inutilizzati.
- Ottimizzazione finale delle curve SVG per evitare clipping su ogni risoluzione.

---

## 📝 Note per il prossimo Agente
- **Analisi Iniziale:** Esegui un `grep` su `AboutSection.tsx` per vedere la struttura del trigger.
- **GSAP:** Tutte le animazioni sono gestite tramite `gsap.context()` per una corretta pulizia in React.
- **Mobile:** L'utente usa un Oppo; la fluidità e il layout single-row sono fondamentali.
- **Branching:** Lavora sempre su branch feature e mergia in `main` solo a task concluso e verificato.
