# Project State: Life Design Festival Website

## 📌 Status Update - May 2, 2026
Phases 1, 2, and 3 are officially **COMPLETED** and merged into `main`. Il sito è ora allineato al design Figma per ordine sezioni, styling Ticket e fix interattivi.

---

## ✅ Completed Tasks
1.  **Phase 1: Layout & Core Identity**: (Completed)
2.  **Phase 2: Modal & Paint Fixes**: (Completed)
3.  **Phase 3: Ticket Section Restyling**: (Completed)
4.  **Phase 4: Sponsor Section Reconstruction**:
    *   Implementato sistema di **Manual Scaling** per bilanciamento ottico fine.
    *   Layout a griglia 1x2 con centratura assoluta interna a ogni colonna.
    *   Ottimizzazione altezze verticali per un design compatto ed elegante.

---

## 🚧 Next Steps (TODO)
1.  **Compliance & SEO**:
    *   [ ] **Cookie Banner**: Implementazione banner GDPR.
    *   [ ] **SEO Optimization**: Meta Tags, OpenGraph images e audit semantico.
2.  **Fine-tuning Life25**:
    *   [ ] Allineamento parametri "Fluidity" (threshold 80, max images 15).

---

## 🛠 Tech Notes & Performance Rules
*   **Sponsor Optical Balancing**:
    *   **Scaling**: Utilizzo di coefficienti `scale` individuali in `sponsorsData.ts` per compensare i padding dei PNG.
    *   **Container**: Altezze compatte (`h-28` per Main, `h-20` per altri) con centratura `object-center`.
    *   **Alignment**: Traslazioni manuali (`translateY`/`translateX`) per loghi critici (Architetti, Etimologia).
    *   **Normalization**: Filtro `brightness(0) invert(1) contrast(200%)`.
*   **Paint System**: Canvas z-index `10000` (modal), `9998` (global).
*   **Fluidità Life25 (Image Trail)**:
    *   **Asset Weight**: Immagini tra **300KB e 600KB** per evitare lag di decodifica GPU.
    *   **DOM Density**: Massimo **15 elementi attivi** (`maxActiveImages: 15`).
    *   **Sampling**: `mouseThreshold: 80` per evitare sovrapposizioni eccessive.
    *   **Engine**: Utilizzo obbligatorio di `gsap.ticker` per sincronizzazione a 60fps.
*   **Typography**: Gestita centralmente in `src/index.css`. Usare tag standard (`h1`-`h6`, `p`).
*   **Scroll**: Modal scroll disabilitato via `overflow-hidden` per evitare disallineamenti del tratto Canvas.
