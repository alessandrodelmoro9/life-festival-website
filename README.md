# 🌀 Life Design Festival 2026 — Website

Benvenuto nel repository ufficiale del **Life Design Festival 2026**. Questo progetto è un'applicazione web moderna ad alte prestazioni, focalizzata su un'estetica editoriale "premium", animazioni GSAP e un sistema visivo di "tracce" (linee SVG) che collegano i contenuti.

---

## 🚀 Tecnologie Core
Il sito è costruito con le ultime tecnologie del mondo Frontend:
- **React 18**: Libreria UI basata su componenti.
- **Vite**: Build tool ultra-veloce per lo sviluppo.
- **TypeScript**: Tipizzazione statica per un codice robusto.
- **GSAP (GreenSock)**: Motore di animazione per ScrollTrigger e countdown fisici.
- **Lenis**: Smooth scrolling per un'esperienza fluida.
- **Tailwind CSS**: Styling utility-first coerente.

---

## 📁 Struttura della Codebase (Aggiornata)

```text
src/
├── components/              # Sezioni modulari del sito
│   ├── HeroSection.tsx      # Apertura con SplitText e traccia SVG
│   ├── AboutSection.tsx     # Introduzione concettuale (in fase di restyling)
│   ├── Countdown.tsx        # [NEW] Timer interattivo con count-up veloce e hover magnetico
│   ├── SpeakersSection.tsx  # Marquee infinito GSAP a due righe per gli ospiti
│   ├── SponsorSection.tsx   # [UPDATED] Layout editoriale "a binari" per i partner
│   ├── SVGLines.tsx         # Elementi grafici condivisi (Tracce e Quadratini)
│   └── ui/                  # Componenti atomici (SpeakerCard, Accordion, etc.)
│
├── data/                    # [CENTRALIZZATO] Contenuti data-driven
│   ├── speakersData.ts      # Database degli ospiti (nomi, bio, social, immagini)
│   └── sponsorsData.ts      # [NEW] Database dei partner e sponsor
│
├── hooks/                   # Logica riutilizzabile (useLenis, useMobile)
├── pages/                   # Pagine principali (Index.tsx, NotFound.tsx)
└── index.css                # Variabili di design e configurazione colori
```

---

## ✨ Feature Spotlight

### ⏱️ Countdown Interattivo (Premium)
- **Fast Count-Up**: All'ingresso nella sezione, i numeri scalano velocemente da zero al tempo reale con curva `expo.out`.
- **Magnetic Hover**: I numeri reagiscono al cursore con uno spostamento fisico e un'ombra profonda (`drop-shadow`).
- **Breathing SVG**: Una singola curva SVG scende dal top-left e "respira" con un'animazione sine-wave sfasata.
- **Visual Continuity**: Quadratini colorati (Blue, Pink, Red) fluttuano nello sfondo richiamando l'estetica della Hero.

### 🤝 Sponsor "Editorial Tracks"
- **Grayscale Filter**: I loghi sono presentati in scala di grigi con opacità al 70%, rivelando colore e dettaglio pieno solo al passaggio del mouse.
- **Layout a Binari**: Gli sponsor sono incorniciati da bordi sottili (`border-foreground/20`) che richiamano i fogli di stile editoriali.
- **Mobile First**: Le etichette degli sponsor hanno un allineamento millimetrico compensato per schermi piccoli.

### 🖋️ Sistema delle "Tracce"
- **Opacità Uniforme**: Tutte le linee decorative SVG sono state standardizzate al `20%` di opacità per non interferire con la leggibilità.
- **GSAP Draw**: Le linee si disegnano dinamicamente durante lo scorrimento, creando un percorso visivo continuo che guida l'utente tra le sezioni.

---

## 🏛️ Architettura dei Dati
Il progetto segue un approccio **Data-Driven**. Per aggiornare i contenuti, basta modificare i file in `src/data/`:
- **Speakers**: Modifica `speakersData.ts` per cambiare ospiti o bio.
- **Sponsors**: Modifica `sponsorsData.ts` per aggiungere loghi o categorie partner.

---

## 📝 Roadmap Evolutiva
1. **Interactive Trace**: Un sistema di disegno (Paint) attivabile dall'About per lasciare "segni" sul sito. [IN SVILUPPO]
2. **Archive 2025**: Galleria fotografica esperienziale dell'edizione passata. [PIANIFICATO]
3. **Mobile Refinement**: Ulteriore ottimizzazione delle curve SVG per schermi verticali stretti.
