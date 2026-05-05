# Project State: Life Design Festival Website

## 📌 Status Update - May 5, 2026
Phases 1-5 are officially **COMPLETED**. Il sistema di vendita ticket è integrato e funzionante via modale Eventbrite.

---

## ✅ Completed Tasks
1.  **Phase 1-4**: (Completed)
2.  **Phase 5: Ticket System Integration**:
    *   Integrazione SDK Eventbrite e inizializzazione tramite React Hook.
    *   Trigger modale checkout integrata (ID: `1985936059213`).
    *   Update Navbar con smooth scroll alla sezione tickets.

---

## 🚧 Next Steps (TODO)
1.  **Phase 6: SEO Full Implementation**:
    *   [ ] Fundamental Meta Tags (Title, Description, Canonical).
    *   [ ] Social & AI Discovery (OG, Twitter Cards, llms.txt).
    *   [ ] Semantic Hierarchy (H1-H3 restructuring).
2.  **Phase 7: Legal Compliance**:
    *   [ ] Iubenda Cookie Solution.
    *   [ ] Prior Blocking for Eventbrite SDK.
3.  **Phase 8: Migration & DNS**:
    *   [ ] `vercel.json` redirects (WP to Vercel).
    *   [ ] Subdomain setup for future FastAPI backend (`api.`).

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
