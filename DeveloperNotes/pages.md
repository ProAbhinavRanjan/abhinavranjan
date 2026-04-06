# Page Summaries & Structural Overview

This document provides a summary of every public-facing HTML page in the Abhinav Ranjan portfolio.

---

## 🏠 Main Pages
### 1. `index.html` (Homepage)
- **Purpose:** Entry point for all visitors.
- **Key Sections:** Hero (Abhinav), About preview, Featured Projects, Social Connects, and Winnings showcase. 
- **Dynamic Data:** Fetches `config.json` for major sections and `popup_index.json` for announcements.

### 2. `about.html` (Detailed Bio)
- **Purpose:** In-depth biography of Abhinav.
- **Key Sections:** Background, Guinness Records, Technical Vision, and a 12-item Skills Grid.
- **Feature:** Uses `loading="lazy"` on profile images to prioritize text content.

### 3. `projects.html` (Portfolio Showcase)
- **Purpose:** Full catalog of all technical and creative projects.
- **Key Sections:** Dynamic grid populated from `projects_page.json`.
- **Feature:** Automates project card rendering with unique fallback gradients.

---

## 🛠️ Specialized Sections
### 4. `biography.html` (Journey & Podcasting)
- **Purpose:** Visual timeline and media hub.
- **Key Sections:** Milestone Timeline (2019-2025), "Tech Talks" Podcast section, and "Books Library" side panel.
- **Feature:** Uses `biography_library.js` for the interactive bookshelf and live podcast sync.

### 5. `winnings.html` (Achievements)
- **Purpose:** Dedicated awards and records page.
- **Key Section:** Achievement Grid with high-impact modal popups for record details.
- **Feature:** Uses high-resolution award images with lazy loading.

### 6. `socials.html` (Digital Directory)
- **Purpose:** Verified linktree-style page for all social platforms.
- **Key Section:** Platform-branded social cards with direct links.
- **Feature:** Uses branded CSS color classes (e.g., `.youtube-red`, `.linkedin-blue`).

---

## ✍️ Content & Stories
### 7. `blog-index.html` (Article Hub)
- **Purpose:** Central repository for tech stories and insights.
- **Key Section:** Searchable blog grid with category filtering (Technology, Innovation, Business).
- **Feature:** Includes a dedicated link to Abhinav's Blogger profile and automated excerpt rendering.

### 8. `post.html` (Dynamic Article Viewer)
- **Purpose:** Standalone viewer for individual blog posts.
- **Feature:** Uses a generic template that is SEO-optimized via dynamic metadata injection (JSON-LD, Canonicals).


---

## 📄 Informational & Legal
### 9. `asked-questions.html` (FAQ Hub)
- **Purpose:** Heavily SEO-optimized knowledge base.
- **Key Sections:** Searchable FAQ accordion and static `<dl>` pre-renderer for search engine crawlers.
- **Feature:** Supports Google FAQ Rich Snippets via JSON-LD metadata.

### 10. `contact.html` (Call to Action)
- **Purpose:** Unified interface for collaborations.
- **Action:** Instead of a backend, it uses client-side redirects to WhatsApp, Email, or Telegram.


### 11. Legal (`privacy-policy.html`, `terms-and-conditions.html`)
- **Purpose:** Standard legal requirements.
- **Styling:** Consistent `legal-content` layout for long-form readability.

### 12. Offline Fallback (`offline.html`)
- **Purpose:** Displayed by the Service Worker when no connection is available.
- **Optimization:** Self-contained CSS/HTML for zero-dependency rendering.


---

## Technical Summary Table
| File | Main Script | Data Source (JSON) |
|---|---|---|
| `index.html` | `script_v105.js`, `popup_index.js` | `config.json`, `popup_index.json` |
| `projects.html` | `script_v105.js` | `projects_page.json` |
| `biography.html` | `script_v105.js`, `biography_library.js` | `biography_page.json`, `lts_podcasts.json` |
| `asked-questions` | `script_v105.js` | `asked_questions_page.json` |
| `blog-index.html` | `blog_library.js` | `blogs.json` |
| `post.html` | `blog_library.js` | `blogs.json` & HTML content snippets |
