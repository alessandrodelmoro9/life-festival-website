# LIFE Design Festival 2026 🎨✨

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-green?logo=greensock)](https://greensock.com/gsap/)

> **"Ogni gesto lascia una traccia."**
> Un'esperienza digitale immersiva e interattiva progettata per la seconda edizione del LIFE Design Festival a Potenza (PZ).

---

## 📖 Visione del Progetto
LIFE Design Festival 2026 non è solo un sito web, ma un'estensione dell'identità visiva dell'evento. Progettato con un approccio **Editorial Deconstructed**, il sito sfida i layout convenzionali per offrire un'esperienza di navigazione che riflette la natura fluida e sperimentale del design contemporaneo.

### Key Highlights
- **Interactive Paint System:** Un canvas globale che permette all'utente di "sporcare" e interagire con il sito, rendendo ogni visita unica.
- **Editorial UX:** Transizioni fluide, tipografia sovradimensionata e un sistema di scroll-telling basato su **GSAP** e **Lenis**.
- **Data-Driven Architecture:** Gestione centralizzata di speaker, sponsor e programma per una scalabilità immediata.

---

## 🛠 Stack Tecnologico & Architettura

### Frontend Core
- **React 18 & TypeScript:** Per una logica di componenti robusta e tipizzata.
- **GSAP (ScrollTrigger):** Gestione avanzata delle animazioni basate sullo scroll e parallasse.
- **Framer Motion:** Micro-interazioni fluide e gestione dello stato delle modali.
- **Shadcn UI & Radix UI:** Componenti atomici accessibili e altamente personalizzabili.

### Performance & UX
- **Lenis Smooth Scroll:** Per una sensazione di scorrimento "premium" e coerente su tutti i browser.
- **Custom Cursor System:** Un cursore reattivo che cambia stato in base al contesto (hover, paint mode, navigation).
- **Responsive Fluidity:** Layout ottimizzati per mobile con logiche editoriali dedicate (es. Hero asimmetrica).

---

## 📂 Struttura della Codebase

```text
LIFE-FESTIVAL-WEBSITE/
├── public/                 # Asset statici, font e immagini
├── src/
│   ├── assets/             # Grafiche vettoriali (SVG) e icone
│   ├── components/         # Moduli UI principali
│   │   ├── paint/          # Core del sistema di disegno
│   │   │   ├── PaintCanvas.tsx
│   │   │   └── PaintToolbar.tsx
│   │   ├── ui/             # Design System (Shadcn/UI components)
│   │   ├── AboutSection.tsx
│   │   ├── Countdown.tsx
│   │   ├── FooterSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LocationSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── ProgramSection.tsx
│   │   ├── SpeakersSection.tsx
│   │   ├── SponsorSection.tsx
│   │   └── SVGLines.tsx
│   ├── context/            # Global State (PaintContext)
│   ├── data/               # Single Source of Truth per i contenuti
│   ├── hooks/              # Logiche riutilizzabili (Lenis, Scroll Animations)
│   ├── lib/                # Utility e configurazioni
│   └── pages/              # Entry point (Index, NotFound)
├── tailwind.config.ts      # Configurazione Design Tokens
└── vite.config.ts          # Pipeline di build ottimizzata
```

---

## 🎨 Design Tokens (Brand Identity)

Il progetto implementa un sistema di colori codificato per tipologia di evento:

| Categoria | Colore | Esadecimale | Utilizzo |
| :--- | :--- | :--- | :--- |
| **Cream** | Background | `#F4EEE4` | Superficie principale |
| **Pink** | Primary | `#FF76BF` | Talk, Hover, Call to Action |
| **Blue** | Secondary | `#7678F6` | Workshop, Default Paint |
| **Orange** | Accent | `#E25938` | Intro, Party, Expo |
| **Brown** | Muted | `#B78F75` | Portfolio Review, Activity |

---

## 🚀 Prossimi Step: Integrazione RAG Chatbot
Il repository è attualmente in fase di espansione per integrare un **Chatbot AI basato su RAG (Retrieval-Augmented Generation)**:
- **Widget Draggable:** Un'interfaccia di chat flottante e spostabile.
- **Backend FastAPI:** Supporto per LLM locali sfruttando hardware di fascia alta (**NVIDIA RTX 5090**).
- **Knowledge Base:** Il bot avrà accesso completo ai dati del festival per rispondere a domande su orari e speaker.

---

## 🔧 Installazione e Sviluppo

```bash
# Clona il repository
git clone git@github.com:alessandrodelmoro9/life-festival-website.git

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev
```

---
*Progetto realizzato da Alessandro Del Moro per LIFE Design Festival - Potenza 2026.*
