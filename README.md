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
    ├── data/                # [NUOVO] Gestione centralizzata dei contenuti
    │   └── speakersData.ts  # Database degli ospiti (nomi, ruoli, social, immagini).
    ├── components/          # Componenti React (Sezioni Modulari)
    │   ├── Navbar.tsx       # Menu con fix per il glitch mobile e link Eventbrite.
    │   ├── HeroSection.tsx  # Apertura con animazioni GSAP SplitText.
    │   ├── SpeakersSection.tsx # [UPDATED] Marquee infinito GSAP a due righe.
    │   ├── ui/              
    │   │   └── SpeakerCard.tsx # [NUOVO] Componente card stile "Business Card".
    │   └── ...              # Altre sezioni (About, Programma, Location, Footer)
    ├── hooks/               # Custom Hooks (useLenis, useMobile, etc.)
    ├── lib/                 # Utility di sistema (cn function)
    ├── pages/               # Pagine dell'applicazione (Index, NotFound)
    └── App.tsx              # Router e Provider globali.
```

---

## 🏛️ Refactoring: Architettura Professionale dei Contenuti
Il progetto è stato evoluto da una struttura statica ("hardcoded") a un'architettura **Data-Driven** professionale:
- **Eliminazione del Codice Hardcoded**: I nomi e i dettagli degli ospiti non sono più "annegati" nel codice dei componenti, una pratica dilettantistica che rende difficile la manutenzione.
- **Database Centralizzato (`src/data/speakersData.ts`)**: Tutti i contenuti degli speaker risiedono in un unico file TypeScript tipizzato. Questo permette di aggiornare l'intera sezione Speaker in pochi secondi senza mai toccare la logica delle animazioni.
- **Scalabilità**: Questa struttura è già predisposta per essere collegata in futuro a un CMS o a un'API esterna senza dover riscrivere la UI.

---

## ✨ Feature Spotlight: Marquee Speakers
Abbiamo trasformato la sezione Speaker in una "Galleria Infinità" ad alto impatto:
- **Design Business Card**: Gli speaker sono presentati come eleganti biglietti da visita orizzontali (`600x340px` su desktop).
- **Infinite Loop GSAP**: Un motore fluido a due righe contrapposte che garantisce movimento costante.
- **Interattività Premium**: Le righe rallentano dell'80% al passaggio del mouse (Hover) per facilitare la lettura dei contenuti.
- **Smart Mobile**: Su smartphone, le card mantengono la forma rettangolare slanciata (`320x170px`) ottimizzando gli spazi.

---

## 🎨 Sistema di Design & Branding

### 🌈 Colori (Variabili CSS)
I colori sono definiti in `src/index.css` e mappati in `tailwind.config.ts`:
- **`primary`**: `--primary` (Blu elettrico).
- **`secondary`**: `--secondary` (Fucsia/Rosa).
- **`accent`**: `--accent` (Arancio/Rosso).

### 🖋️ Tipografia
- **`font-display` (Aquawax)**: Per titoli e scritte d'impatto.
- **`font-body` (Automat-Grotesk)**: Per testi, menu e descrizioni.

---

## 🛠️ Note per l'Aggiornamento Contenuti

### Aggiungere/Modificare uno Speaker
Non è necessario toccare il codice delle animazioni. Modifica semplicemente il file:
`src/data/speakersData.ts`
```typescript
{
  id: 1,
  name: "Nuovo Nome",
  role: "Ruolo",
  description: "Descrizione breve...",
  color: 'primary', // Scegli tra 'primary', 'secondary', 'accent'
  socials: { instagram: "link", linkedin: "link" }
}
```

### Inserire Immagini (Prossimamente)
1. Carica le foto in `public/speakers/`.
2. Aggiungi il campo `image: "/speakers/nome-file.jpg"` nell'oggetto speaker desiderato.

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

## 📝 Road Map
1. **Chatbot RAG**: Integrazione widget fluttuante collegato ad API FastAPI. [IN PIANIFICAZIONE]
2. **Ottimizzazione UI**: Rimozione dei componenti Shadcn inutilizzati.
