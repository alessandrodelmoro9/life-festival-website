# Project State - LIFE Design Festival 2026

## Overall Goal
Implement a high-end, editorial-style interactive website for LIFE Design Festival 2026, featuring a "Paint" drawing system, smooth scrolling (Lenis), and a dynamic Speakers section.

## Current Branch
`feature/editorial-expand-list` (Stable & Optimized)

## Technical Architecture
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (for custom cursors/effects)
- **Animations:** GSAP (ScrollTrigger) + Framer Motion
- **Smooth Scroll:** Lenis
- **UI Components:** Shadcn/UI (Radix Primitives)
- **Paint Context:** Global state management for strokes and context (modal vs site).

## Key Achievements & Current Status

### 1. Speakers Section (Editorial Style)
- **Grid Layout:** 2-column layout with initial 4 speakers visible.
- **Isolate Hover:** Non-hovered items fade to `0.15` opacity.
- **Pink Hover State:** Background turns `#F472B6` on hover.
- **Expandable:** Staggered entrance for the remaining lineup.
- **Modal:** Immersive full-screen dialog with `#F472B6` background, optimized for mobile.

### 2. Paint System (Optimized)
- **Context Filtering:** Drawings are separated between the main site and individual speaker modals.
- **Mobile Fluidity:** Added `touch-action: none` and `touch-none` class to prevent scroll interference while drawing.
- **Z-Index Layering:** Canvas stays visible over modals (`z-10000`) but allows navigation when not in 'draw' mode.
- **Persistence:** Strokes are saved in a global context array, filtered by `activeSpeakerId`.

### 3. Life25 Section (Interactive Image Trail)
- **Visuals:** Monumental "life 25" outline typography in Aquawax font (25vw).
- **Interactive Effect:** "Image Trail" system that generates image sequences from the `life25` archive on mouse/touch movement.
- **Animations:** GSAP-powered scale-in and fade-out/collapse logic (800ms lifespan).
- **Optimization:** High-performance DOM node management and speed-dependent intensity calculation.

### 4. Countdown & Layout
- **Visuals:** 4-block palette-based countdown (Brown, Pink, Orange, Blue).
- **Animations:** GSAP-powered count-up and scroll entrance.
- **Header:** Hero section with `SplitText` for "Life Design Festival".

## Current Codebase Functions
- **Navigation:** Smooth anchor scrolling via Lenis.
- **Interaction:** Custom cursor that changes based on hover/paint mode.
- **Content:** Dynamic data loading for speakers and sponsors.
- **Paint:** Draw, undo last stroke, and clear all functionality.

## Next Steps (Planned)
1. **Modal Scroll Sync:** Synchronize the paint canvas with the internal scroll of the speaker modals.
2. **Performance Audit:** Implement stroke simplification for very long drawings.
3. **Deployment:** Merge current stable feature branch into `main` and push to remote.

## File System (Summary)
- `src/components/paint/`: Core drawing logic.
- `src/components/SpeakersSection.tsx`: Editorial lineup and modals.
- `src/context/PaintContext.tsx`: Drawing state.
- `src/pages/Index.tsx`: Main entry point assembling all sections.
