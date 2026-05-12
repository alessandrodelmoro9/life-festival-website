# Project State - Life Design Festival 2026

## 🎯 Overall Goal
Finalize and deploy the Life Design Festival 2026 website, ensuring optimal SEO, mobile UX stability, and consistent brand typography across all interactive components.

## 🛠️ Active Constraints & Standards
- **SEO Hierarchy**: Strictly one `h1` per page (Hero section). Sub-sections use `h2` + `.text-h1` utility class.
- **Visual Decoupling**: Font sizes managed via `.text-h1` to `.text-h6` classes in `index.css`.
- **Compliance**: Meta Pixel integrated with Iubenda "Prior Blocking" (`type="text/plain"`, class `_iub_cs_activate`).
- **Cache Policy**: Optimized `vercel.json` with 1-year cache for assets/fonts and `max-age=0` for `index.html`.
- **Mobile Precision**: Hero cluster fixed at 348px width with exact Figma dimensions (Icons 82px, Button 79px).

## ✅ Completed Tasks
1. **SEO & Accessibility**: Validated heading hierarchy and meta tags.
2. **Typography Refinement**: Standardized About, Tickets, and Speaker Modal typography.
3. **Bug Fixes**: 
    - Resolved Mac/Safari hover flickering in Speakers section.
    - Fixed Vercel build error caused by `<noscript>` in `<head>`.
    - Corrected "Cromia Design" role and "Workshop" title redundancy.
4. **Integration**: Meta Pixel fully integrated and GDPR compliant.
5. **UI Stabilization**: Hero button size fixed across Android and iOS.

## 🚀 Current Status: Domain Migration
- **Branch**: `main` is up-to-date and production-ready.
- **Deployment**: Local build verified (`npm run build`).
- **DNS Phase**: Instructions sent for pointing `lifedesignfestival.it` to Vercel (Record A: `216.198.79.1`, CNAME: `35aa11e6555da0ce.vercel-dns-017.com.`).

## ⚠️ Potential Deployment Issues (Watchlist)
1. **Propagation Latency**: DNS changes can take 1-24 hours. Users might see the old site or a "Not Found" page during this window.
2. **SSL Wait Time**: Vercel generates the certificate *after* DNS is verified. The site might show a security warning for a few minutes once it first points to Vercel.
3. **Local Browser Cache**: Users who visited the `.vercel.app` version might need to hard-refresh (`Cmd+Shift+R` or `Ctrl+F5`) to see the latest fixes if they bypass the new cache headers initially.
4. **Register.it Interface**: Some registrars require a dot `.` at the end of CNAME values; if it fails, try without the trailing dot.

## 📝 Personal Notes
The project is in a highly polished state. All typography matches Figma specs, and performance headers are optimized for a smooth launch.
