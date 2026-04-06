# Configuration, Metadata & JSON Schema

This document outlines the core data structures and metadata configurations that define the portfolio's identity and its "Single Source of Truth."

---

## 🛠️ Global Configuration: `config.json`
The **primary database** for the portfolio's identity. Fetched on every page by `script_v105.js`.

- **Personal Info:** Name, role, profiles, and image paths.
- **Meta Tags:** SEO title and description templates.
- **Featured Items:** Hardcoded subsets for Projects, Winnings, and Socials (3 items each) for high-performance home rendering.
- **Contact:** WhatsApp number, email, and Telegram handles.

---

## 📈 Metadata & SEO
### 1. `robots.txt`
Controls search engine access. Explicitly blocks the private LTS platforms (`/frontend/lts/`) and the `offline.html` page to maintain a focused search index.

### 2. `sitemap.xml`
A machine-readable list of all public URLs. URLs are assigned priorities:
- **Index:** 1.0
- **Projects/Biography:** 0.9
- **Legal/Socials:** 0.7 - 0.4

### 3. `manifest.json`
Configuration for the PWA experience. Defines app name ("AR."), standalone mode, and maskable icons for homescreen installations.

---

## 🗄️ JSON Data Schemas
Every dynamic section in the portfolio has its own JSON source:

| File | Purpose | Key Data |
|---|---|---|
| `projects_page.json` | Projects catalog | Title, Tags, Image, Link, Gradient |
| `socials_page.json` | Social media grid | Platform, URL, FontAwesome Icon |
| `winnings_page.json` | Achievements | Title, Date, Long Description, Image |
| `biography_page.json` | Biography media | Book IDs, Podcast Spotify/Apple links |
| `asked_questions_page.json` | FAQ system | 17 Question+Answer pairs |
| `popup_index.json` | Home announcements | Section title, Tab name, Image carousel |
| `blogs.json` | Blog database | Title, ID, Date, Author, Excerpt, Image, Path |

---

## 🛡️ Best Practices & Optimization
- ✅ **Cached Data:** All JSON files are pre-cached by the Service Worker for instant offline availability.
- ✅ **Canonical URLs:** Every page points to its primary URL to prevent search engine confusion.
- ✅ **UTF-8 Support:** All JSON files are encoded in UTF-8 to support international characters and symbols.
- ⚠️ **Data Redundancy:** Always ensure that `config.json`'s featured items are kept in sync with the full catalog JSONs (`projects_page.json`, etc.) if significant updates are made.
