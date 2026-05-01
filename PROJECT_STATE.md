# Project State: Life Design Festival Website

## 📌 Status Update - May 1, 2026
We are currently on branch `feat/speakers-and-life25-updates`. The goal is to refine the Speakers and Life25 sections for the new brand identity (Pink #FF76BF / Anthracite #262626).

---

## ✅ Completed Tasks
1.  **Speakers Section Redesign**:
    *   Added Samuela Vaccari as "Host" with a custom 2-column grid layout (190px height).
    *   Standard speakers set to 150px height.
    *   Implemented left-aligned, vertically centered text with `whitespace-nowrap`.
    *   Fixed "Riduci lista" scroll logic with `scroll-mt-24` to avoid header overlap.
2.  **Life25 Aesthetic Overhaul**:
    *   Updated colors to Pink/Anthracite.
    *   Added four corner labels ("RICORDI", "DALLA", "SCORSA", "EDIZIONE") at `z-30`.
    *   Desktop Typography: Lowercase "life 25" on a single line.
    *   Mobile Typography: Stacked uppercase "LI-FE-25" in a 2-column grid to form a perfect "tall rectangle" block.
3.  **Life25 Depth Effect**:
    *   Implemented layered `z-index`: Letters `l`, `f`, `2` are at `z-[13]` (Above), Images are at `z-[12]` (Middle), Letters `i`, `e`, `5` are at `z-[11]` (Below).
4.  **Image Optimization**:
    *   Compressed 15 heavy JPGs in `public/assets/life25/`. Sizes reduced from ~5MB to ~500KB-1.5MB. Total payload is significantly lighter.

---

## 🚧 Current Blockers & Next Steps
1.  **Interaction Lag (Life25)**:
    *   **Observation**: Despite compression and returning to the stable GSAP logic from `main`, some micro-stuttering persists.
    *   **Attempted**: Canvas refactor (abandoned due to layering issues) and Object Pooling (abandoned as it felt "clunky").
    *   **Current State**: Using the original stable logic + a new rotational exit effect (`rotation: imgObj.rotation + 45`).
    *   **Recommendation**: Monitor performance after a fresh system restart/cache clear. If lag persists, consider converting images to `.webp` or further reducing `maxActiveImages` (currently 15).
2.  **Merging**:
    *   Once the lag is confirmed resolved by the user, merge `feat/speakers-and-life25-updates` into `main`. This is critical to ensure the Vercel deployment has access to the new compressed assets and corrected logic.

---

## 🛠 Tech Notes for Next CLI
*   **Cursor**: Uses `Pointer.svg` (32x32px). System cursor is hidden via `index.css`.
*   **Typography**: `Automat Grotesk` has a global `tracking-normal` override.
*   **GSAP Ticker**: The Life25 scroller uses the `gsap.ticker` for updates. Ensure `passive: true` listeners are maintained for scroll performance.
*   **Reference**: `instruction_component.txt` contains alternate trail effects (Liquid, Venetian) if the client requests more complexity later.
