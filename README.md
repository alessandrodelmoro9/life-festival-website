# LIFE Design Festival 2026 — Website

Sito web ufficiale del LIFE Design Festival 2026, un evento dedicato al design, alla creatività e all'innovazione a Potenza.

## 🚀 Architettura Tecnica

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (Approccio Editorial/High-end)
- **Animazioni:** GSAP + ScrollTrigger + Framer Motion
- **Smooth Scroll:** Lenis
- **Interactive:** Custom Paint System (Canvas API + Context)

## 📁 Struttura del Progetto (Ottimizzata)

```text
src/
├── assets/          # SVG e icone di sistema
├── components/      # Componenti React organizzati per sezione
│   ├── ui/          # Componenti atomici (Shadcn/UI ottimizzati)
│   └── paint/       # Sistema di disegno interattivo
├── context/         # Gestione dello stato globale (Paint, UI)
├── data/            # Singola fonte di verità per contenuti (Speakers, Programma, Sponsor)
├── hooks/           # Hook personalizzati (Scroll, Mobile, Lenis)
└── lib/             # Utility e configurazioni (Tailwind Merge, cn)

public/
└── assets/          # Asset statici organizzati
    ├── logos/       # Loghi degli sponsor
    ├── speakers/    # Foto degli ospiti
    ├── location/    # Immagini della venue
    └── fonts/       # Webfont Aquawax e Automat
```

## 🛠 Manutenzione e Aggiornamento

### Aggiungere uno Speaker
Modificare il file `src/data/speakersData.ts`. Caricare l'immagine in `public/assets/speakers/`.

### Aggiungere uno Sponsor
Modificare il file `src/data/sponsorsData.ts`. Caricare il logo in `public/assets/logos/`.

### Modificare il Programma
Modificare il file `src/data/programData.ts`. Il sistema Dual Timeline si aggiornerà automaticamente.

---
*Progetto curato per LIFE Design Festival 2026.*
