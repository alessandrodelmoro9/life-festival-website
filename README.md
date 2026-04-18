# LIFE Design Festival 2026 - Interactive Website

Sito ufficiale del LIFE Design Festival 2026. Un'esperienza digitale interattiva costruita per celebrare il design e la creatività, caratterizzata da un'estetica editoriale e un sistema di disegno interattivo.

## Caratteristiche Principali
- **Editorial Design:** Sezioni speaker con focus dinamico, liste espandibili e layout tipografico curato.
- **Interactive Paint System:** Sistema di disegno su canvas (sito e modali) con persistenza del contesto.
- **Palette Countdown:** Timer grafico basato sulla color palette ufficiale (Marrone, Rosa, Arancione, Blu).
- **Smooth Scrolling:** Navigazione fluida tramite Lenis e animazioni GSAP.
- **Custom Cursor:** Cursore interattivo che si adatta alle modalità del sito.

## Stack Tecnologico
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Vanilla CSS
- **Animazioni:** GSAP (ScrollTrigger) + Framer Motion
- **Smooth Scroll:** Lenis (@studio-freight/lenis)
- **UI Components:** Radix UI (via Shadcn/UI)
- **Icons:** Lucide React

## Struttura del Progetto
```text
C:.
├── public/                     # Asset statici
│   ├── fonts/                  # Font: Aquawax & Automat Grotesk
│   ├── img_ospiti/             # Fotografie degli speaker
│   ├── location/               # Immagini della location (PZ)
│   └── loghi_sponsor/          # Loghi dei partner e sponsor
├── src/                        # Codice sorgente
│   ├── assets/                 # Logo e icone SVG
│   ├── components/             # Componenti React
│   │   ├── paint/              # Logica del sistema di disegno (Canvas, Toolbar)
│   │   ├── ui/                 # Componenti UI atomici (shadcn) e Custom Cursor
│   │   ├── AboutSection.tsx    # Trigger per attivazione Paint
│   │   ├── Countdown.tsx       # Timer a blocchi colorati
│   │   ├── HeroSection.tsx     # Intro con SplitText animation
│   │   ├── SpeakersSection.tsx # Lista editorial con modali immersivi
│   │   └── ...                 # Altre sezioni (Program, Location, Sponsors, Footer)
│   ├── context/                # Stato globale (PaintContext)
│   ├── data/                   # Dataset (Speaker, Sponsor)
│   ├── hooks/                  # Custom hook (useLenis, useScrollAnimation)
│   ├── lib/                    # Utility (clsx, tailwind-merge)
│   └── pages/                  # View principali (Index, NotFound)
├── tailwind.config.ts          # Configurazione design system
└── vite.config.ts              # Configurazione build tool
```

## Sviluppo Locale
1. Installa le dipendenze:
   ```bash
   npm install
   ```
2. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## Note Tecniche Recenti
- **Paint System:** Ottimizzato per mobile con `touch-action: none`.
- **Z-Index:** Gestione dinamica degli strati per permettere il disegno sopra i modali.
- **Speakers:** Eccezioni di formattazione CAPS per "PUG", "EGO55", "AUGE".
