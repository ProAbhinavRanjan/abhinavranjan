# Portfolio Logic & JavaScript Architecture

This document summarizes the core JavaScript engines that drive the interactivity, data-fetching, and offline capabilities of the Abhinav Ranjan portfolio.

---

## 1. Main Engine: `script_v105.js`
The **primary core script** loaded by almost every page. It acts as the central orchestrator for the site.

- **Core Responsibilities:**
    - Fetches `config.json` and page-specific JSON data.
    - Populates all dynamic content via `[data-var]` attributes.
    - Renders interactive grids for projects, winnings, and socials.
    - Manages UI components: Hamburger menu, scroll animations (Intersection Observer), 3D card tilt, and modals.
    - Handles the multi-platform contact form (WhatsApp, Email, Telegram).
- **Key Modules:**
    - **FAQ Accordion:** Manages the searchable 17-item FAQ system.
    - **Winnings Modal:** Handles the detailed achievement view.
    - **Toast Notifications:** Provides visual feedback for form validation.
- **Optimization:** Uses `defer` for non-blocking loads and Intersection Observer for performant animations.

---

## 2. Specialized Logic: `biography_library.js`
A dedicated "mini-app" script only loaded on `biography.html`.

- **Books Library:** Handles the sophisticated slide-in side panel, real-time search filtering, and the PDF/Iframe previewer for Abhinav's publications.
- **Podcast Integration:** Synchronizes with the LTS platform to show "Live" or "Upcoming" sessions and falls back to static episodes if needed.
- **Dynamic Styling:** Injects custom CSS keyframes for pulsing "LIVE" badges directly into the document head.

---

## 4. Blog Engine: `blog_library.js`
A specialized script for the dynamic blog system.

- **Dual-Mode Logic:** Detection of `blogGrid` for the index page vs. `postBody` for the single post viewer.
- **Dynamic Content Injection:** Use of `fetch()` to retrieve HTML snippets from the `/blogs/content/` directory.
- **Search & Filtering:** Real-time client-side search and category filtering for the blog index.
- **Advanced SEO Engine:**
    - **JSON-LD:** Dynamically injects `BlogPosting` structured data into the document head.
    - **Meta Sync:** Updates Titles, Canonical Tags, OpenGraph, and Twitter Meta tags in real-time based on the active post.
    - **Site-Wide URLs:** Uses `https://abhinavranjan.netlify.app` as the base for absolute canonical and social URLs.

---

## 5. PWA Core: `sw.js` (Service Worker)
Enables **Progressive Web App** features and offline support.

- **Strategy:** Network-First with Cache Fallback. Always attempts to fetch the latest content but provides cached assets if the connection is lost.
- **Offline Fallback:** Specifically serves `offline.html` if a new page is requested without a connection.
- **Asset Caching:** Pre-caches all critical CSS, JS, and global JSON data on installation (Cache version `v1.0.9`).

---

## 6. Metadata Logic: `manifest.json`
Defines the PWA identity (name, icons, theme color, display mode). Allows the site to be installed as a standalone app on mobile devices.

---

## Optimization & Security Notes
- ✅ **Serverless Architecture:** No backend processing; all interactions are client-side redirects or local JS logic.
- ⚠️ **Data Integrity:** Most UI is rendered via `innerHTML`. Ensure source JSON files are kept secure.
- ⚠️ **External Assets:** Scripts like `popup_index.js` rely on third-party images; local hosting is recommended for 100% reliability.
