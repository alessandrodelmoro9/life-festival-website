# 🌀 Life Design Festival 2026 — Website

Benvenuto nel repository ufficiale del **Life Design Festival 2026**. Questo progetto è un'applicazione web moderna ad alte prestazioni, focalizzata su un'estetica ricercata, animazioni fluide e un'esperienza utente di alto livello (Smooth Scrolling).

---

## 🚀 Tecnologie Core
Il sito è costruito con le ultime tecnologie del mondo Frontend:
- **React 18**: Libreria UI basata su componenti.
- **Vite**: Build tool ultra-veloce per lo sviluppo.
- **TypeScript**: Tipizzazione statica per un codice più robusto e manutenibile.
- **Tailwind CSS**: Framework CSS utility-first per lo styling rapido e coerente.
- **GSAP (GreenSock)**: Motore di animazione leader del settore per gli effetti di scorrimento (ScrollTrigger).
- **Lenis**: Libreria per lo "Smooth Scroll" (scorrimento fluido).
- **Shadcn/UI**: Sistema di componenti modulari basati su Radix UI.
- **TanStack Query**: Già configurato per la gestione futura di dati dinamici/API.

---

## 📁 Struttura Completa del Progetto (Tree /f)

```text
C:\Users\Utente\Desktop\life website\life-design-scroll\
├── .gitignore               # Esclude node_modules e file di build da Git.
├── bun.lock / bun.lockb     # File di lock per il package manager Bun.
├── components.json          # Configurazione di Shadcn/UI.
├── eslint.config.js         # Regole per la qualità del codice (Linting).
├── index.html               # Entry point HTML, SEO Meta Tags e Favicon.
├── package.json             # Dipendenze e script (dev, build, test).
├── postcss.config.js        # Post-processore per Tailwind CSS.
├── README.md                # Questa guida tecnica.
├── tailwind.config.ts       # Configurazione temi, colori e animazioni.
├── tsconfig.json            # Configurazione TypeScript globale.
├── vite.config.ts           # Configurazione del bundler Vite.
│
├── public/                  # Asset statici (accessibili via /nomefile)
│   ├── favicon.svg          # Logo ufficiale (Icona Tab).
│   ├── placeholder.svg      # Immagine segnaposto per contenuti mancanti.
│   ├── robots.txt           # Configurazione per motori di ricerca.
│   └── fonts/               # Font locali: Aquawax (Display) e Automat (Body).
│
└── src/                     # Codice sorgente dell'applicazione
    ├── App.tsx              # Router, Provider di Query e Toaster (notifiche).
    ├── index.css            # Variabili CSS dei colori e reset globale.
    ├── main.tsx             # Avvio di React.
    │
    ├── assets/              # Icone e immagini processate (es. logo.svg).
    │
    ├── components/          # Componenti React (Sezioni Modulari)
    │   ├── Navbar.tsx       # Menu con fix per il glitch mobile e link Eventbrite.
    │   ├── HeroSection.tsx  # Apertura con animazioni GSAP SplitText.
    │   ├── AboutSection.tsx # Descrizione del festival.
    │   ├── SpeakersSection.tsx # Sezione ospiti (Target per Marquee).
    │   ├── ProgramSection.tsx  # Palinsesto del festival.
    │   ├── LocationSection.tsx # Mappa interattiva e link Eventbrite.
    │   ├── FooterSection.tsx   # Chiusura con social link ufficiali.
    │   ├── SVGLines.tsx        # Elementi vettoriali animati.
    │   └── ui/              # Libreria di 53 componenti atomici Shadcn.
    │
    ├── hooks/               # Custom Hooks
    │   ├── useLenis.ts      # Attiva lo Smooth Scroll fluido.
    │   ├── use-mobile.tsx   # Rilevamento dispositivi mobile.
    │   └── useScrollAnimation.ts # Trigger animazioni GSAP su scroll.
    │
    ├── lib/                 # Utility di sistema
    │   └── utils.ts         # Gestione classi Tailwind (funzione 'cn').
    │
    ├── pages/               # Pagine dell'applicazione
    │   ├── Index.tsx        # Main Landing Page (Single Page).
    │   └── NotFound.tsx     # Pagina di errore 404.
    │
    └── test/                # Setup per test automatici (Vitest).
```

---

## 🎨 Sistema di Design & Branding

### 🌈 Colori (Variabili CSS)
I colori sono definiti in `src/index.css` e mappati in `tailwind.config.ts`:
- **`primary`**: `--primary` (Blu elettrico) - Action color.
- **`secondary`**: `--secondary` (Fucsia/Rosa) - Accent color.
- **`accent`**: `--accent` (Arancio/Rosso) - Highlight color.

### 🖋️ Tipografia
- **`font-display` (Aquawax)**: Per titoli e scritte d'impatto.
- **`font-body` (Automat-Grotesk)**: Per testi, menu e descrizioni.

---

## 🛠️ Note Tecniche & Ottimizzazione

### 1. Gestione dei Dati (Futuro)
Attualmente i dati (Speaker, Programma) sono **hardcoded** nei componenti. 
- **Piano**: Estrarre questi dati in file JSON esterni per facilitare la manutenzione.

### 2. Performance (GSAP & Lenis)
Tutte le animazioni utilizzano `gsap.context()` all'interno di `useEffect` per garantire la pulizia dei trigger ed evitare perdite di memoria (memory leaks).

### 3. SEO & Social
Il file `index.html` è stato configurato con metadati Open Graph per garantire un'anteprima corretta su WhatsApp, LinkedIn e Facebook utilizzando il nuovo logo SVG.

---

## 💻 Comandi Utili

### Sviluppo Locale
```bash
npm run dev
```

### Build per la Produzione
```bash
npm run build
```

---

## 📝 Road Map Prossime Feature
1. **Marquee Speakers**: Implementazione scorrimento infinito GSAP per 15+ ospiti.
2. **Chatbot RAG**: Integrazione widget fluttuante collegato ad API FastAPI.
3. **Ottimizzazione UI**: Rimozione dei componenti Shadcn inutilizzati in `/ui/`.
