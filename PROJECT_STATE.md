# Project State: Life Design Festival Website

## 📌 Status Update - May 6, 2026 (Pre-Launch Final)
The website is **Launch-Ready**. All technical, semantic, and legal optimizations have been implemented, tested, and pushed to the `main` branch on Vercel.

---

## ✅ Completed Tasks (Launch Preparation)

### 1. Technical SEO & AI Optimization
*   **Semantic Hierarchy**: Consolidated H1/H2/H3 structure. Single H1 on the landing page for maximum SEO authority.
*   **Meta Tags**: Complete suite for Google Discover, Social Cards (Open Graph/Twitter), and Local SEO (Geo-tags).
*   **AI Context**: Generated `llms.txt` with full event context (concept, speakers, sponsors).
*   **Search Discovery**: `robots.txt` and `sitemap.xml` generated and ready for indexing.

### 2. Legal & Stability
*   **Iubenda Integration**: Cookie banner customized with brand colors (`#F4EEE4`) and positioned for optimal UX (`float-bottom-center`).
*   **GDPR Compliance**: Manual prior-blocking for Eventbrite SDK (reverted to standard for stability after testing).
*   **Cross-Browser Fixes**: 
    *   Disabled Lenis smooth scroll on touch devices to prevent Safari/iOS crashes.
    *   Removed Iubenda Autoblocking to resolve WebKit mutation conflicts.

### 3. Infrastructure
*   **Vercel Configuration**: `vercel.json` implemented with 301 redirects for legacy WordPress paths and SPA routing rewrites.
*   **Deployment**: Final stable version merged into `main` and live on Vercel preview URL.

---

## 🚀 Immediate Next Steps

### 1. DNS Migration (TODAY - 15:00)
Provide these records to the domain manager (Register.it):
*   **Record A**: `@` -> `216.198.79.1`
*   **Record CNAME**: `www` -> `35aa11e6555da0ce.vercel-dns-017.com.`

### 2. Final Content Update (TOMORROW)
*   [ ] Replace placeholder texts with definitive editorial content.
*   [ ] Verify and update talk times/titles in `src/data/programData.ts`.
*   [ ] Final check of speaker bios in `src/data/speakersData.ts`.

### 3. Post-Migration Verification
*   [ ] Verify SSL certificate generation on Vercel.
*   [ ] Submit `sitemap.xml` to Google Search Console.
*   [ ] Verify Iubenda banner registration for the official domain.

---

## 🛠 Tech Notes
*   **Core Branch**: `main` (Production).
*   **iOS Stability**: Lenis is disabled on touch devices; Safari uses native momentum scrolling.
*   **Eventbrite**: Widget is active and initialized via standard script loading for 100% conversion reliability.
