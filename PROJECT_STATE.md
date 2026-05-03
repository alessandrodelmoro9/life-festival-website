# Project State: Life Design Festival Website

## 📌 Status Update - May 2, 2026
Phases 1, 2, and 3 are officially **COMPLETED** and merged into `main`. Il sito è ora allineato al design Figma per ordine sezioni, styling Ticket e fix interattivi.

---

## ✅ Completed Tasks
1.  **Phase 1: Layout & Core Identity**:
    *   Riordinato sezioni: Location -> Life 25 -> Tickets.
    *   Fix Navbar Ticket CTA: Testo/freccia neri di default (`#262626`).
    *   Risolto flicker "doppio cursore" su Mac con `cursor: none !important` globale.
2.  **Phase 2: Modal & Paint Fixes**:
    *   Fix persistenza e rendering disegni Host (ID 0).
    *   Coordinate relative al viewport per i disegni nei modali.
    *   Azioni Paint globalizzate: "Undo" e "Clear All" influenzano tutti i contesti.
3.  **Phase 3: Ticket Section Restyling**:
    *   Ricostruito con rigore geometrico (rounded-none, no shadows).
    *   Sincronizzazione gerarchia tipografica con `index.css`.
    *   Integrazione `backg ticket.svg` come sfondo sezione.

---

## 🚧 Next Steps (TODO)
1.  **Phase 4: Sponsor Section Update**:
    *   Refactor grid in categorie: Main, Experience, Active, Partner, Community, Patrocini.
    *   Integrazione nuovi loghi SVG bianchi.
2.  **Compliance & SEO**:
    *   [ ] **Cookie Banner**: Implementazione banner GDPR.
    *   [ ] **SEO Optimization**: Meta Tags, OpenGraph images e audit semantico.
3.  **Fine-tuning Life25**:
    *   [ ] Allineamento parametri "Fluidity" (threshold 80, max images 15).

---

## 🛠 Tech Notes & Performance Rules
*   **Paint System**: Canvas z-index `10000` (modal), `9998` (global).
*   **Fluidità Life25 (Image Trail)**:
    *   **Asset Weight**: Immagini tra **300KB e 600KB** per evitare lag di decodifica GPU.
    *   **DOM Density**: Massimo **15 elementi attivi** (`maxActiveImages: 15`).
    *   **Sampling**: `mouseThreshold: 80` per evitare sovrapposizioni eccessive.
    *   **Engine**: Utilizzo obbligatorio di `gsap.ticker` per sincronizzazione a 60fps.
*   **Typography**: Gestita centralmente in `src/index.css`. Usare tag standard (`h1`-`h6`, `p`).
*   **Scroll**: Modal scroll disabilitato via `overflow-hidden` per evitare disallineamenti del tratto Canvas.
