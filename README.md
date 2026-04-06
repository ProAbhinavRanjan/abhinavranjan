# AR. Abhinav Ranjan — Personal Portfolio

> **Live Site:** [abhinavranjan.netlify.app](https://abhinavranjan.netlify.app)  
> **Type:** Static Website (Vanilla HTML / CSS / JavaScript) + PWA  
> **Deployed on:** Netlify CDN

---

## 🧑‍💻 About the Project

This is the official personal portfolio of **Abhinav Ranjan** — a young cybersecurity educator, ethical hacking teacher, and founder of **Luminary Technicals** from Muzaffarpur, Bihar, India, recognized by Guinness World Records and the Golden Book of World Records.

The site is a **data-driven, multi-page static portfolio** with no build step — all content is loaded dynamically from JSON files at runtime. It supports offline access via a Service Worker (PWA), has a custom popup announcement system, a full-featured FAQ page with JSON-LD structured data for Google rich snippets, and an advanced biography page with a book library reader.

---

## 🗂️ Project File Tree

```
abhinavranjan/
│
├── index.html                          # Homepage (hero, about preview, projects, socials, winnings)
├── robots.txt                          # Search engine crawl rules
├── sitemap.xml                         # XML sitemap (all pages, .html extensions)
├── manifest.json                       # PWA Web App Manifest
├── sw.js                               # Service Worker (offline support / caching)
├── offline.html                        # Shown when user is offline and no cache exists
├── google293c856bf4821b95.html         # Google Search Console verification file
│
├── images/
│   ├── arlogo.png                      # Site logo / favicon / PWA icon (15 KB)
│   └── profile.png                     # Profile photo of Abhinav Ranjan (72 KB)
│
├── frontend/
│   ├── css/
│   │   └── styles.css                  # Global stylesheet (all pages share this)
│   │
│   ├── logic/
│   │   ├── script_v105.js              # Main JS engine (data loading, rendering, interactions)
│   │   ├── popup_index.js              # Popup/announcement modal renderer
│   │   ├── biography_library.js        # Books library side panel (biography page only)
│   │   ├── script.js                   # Legacy/unused JS (superseded by script_v105.js)
│   │   └── time_sync.js                # Online time sync via WorldTimeAPI (LTS platform)
│   │
│   ├── data/
│   │   ├── config.json                 # Global config (name, contact, projects, socials, footer)
│   │   ├── projects_page.json          # Projects data (full projects list)
│   │   ├── socials_page.json           # Social media handles / links
│   │   ├── winnings_page.json          # Awards & achievements data
│   │   ├── biography_page.json         # Books library + podcast episodes data
│   │   ├── asked_questions_page.json   # FAQ content (17 Q&As)
│   │   ├── popup_index.json            # Popup announcement data (enabled/sections/carousel)
│   │   └── lts_podcasts.json           # LTS Platform podcast data
│   │
│   ├── html/
│   │   ├── about.html                  # About page (background, skills, photo)
│   │   ├── biography.html              # Biography timeline + podcast + books library
│   │   ├── projects.html               # All projects grid
│   │   ├── socials.html                # All social media handles
│   │   ├── winnings.html               # Awards & achievements with modal
│   │   ├── contact.html                # Contact form (WhatsApp / Email / Telegram)
│   │   └── moredetails/
│   │       ├── asked-questions.html    # FAQ page (JSON-LD FAQPage, static pre-render)
│   │       ├── privacy-policy.html     # Privacy Policy
│   │       └── terms-and-conditions.html # Terms & Conditions
│   │
│   └── lts/                            # LTS Platform (Live Telecast Server) — NOT indexed
│       ├── lts-index.html              # LTS homepage / server browser
│       ├── lts-join.html               # LTS room join page
│       ├── lts-room.html               # LTS live room interface
│       └── lts-podcasts.js             # LTS podcast logic
│
└── DeveloperNotes/                     # Developer documentation (Consolidated)
    ├── logic.md                        # Main JS & Service Worker logic
    ├── css.md                          # Styling & Design System overview
    ├── lts.md                          # LTS Platform architecture & logic
    ├── pages.md                        # HTML structure & features per page
    └── configuration.md                # Metadata, SEO, and JSON data schema
```

---

## ✨ Major Features

| Feature | Details |
|---|---|
| **Data-driven content** | All projects, socials, winnings, FAQ rendered from JSON via `fetch()` |
| **Popup announcement system** | Multi-section modal carousel driven by `popup_index.json` |
| **FAQ with rich snippets** | FAQPage JSON-LD schema + static DOM pre-render for Google |
| **Books library** | Slide-in side panel with PDF viewer, search, mobile dropdown |
| **PWA / Offline** | Service Worker (cache-first), manifest, offline fallback page |
| **3D card tilt effect** | Mouse-tracked perspective rotation on all `.card` elements |
| **Scroll animations** | Intersection Observer drives `fade-in-up` on all sections |
| **Contact multi-platform** | Form sends to WhatsApp, Email, or Telegram from config |
| **Winnings modal** | Click-to-expand card detail modal on winnings page |
| **LTS Platform** | Separate live podcast/telecast server interface (`/frontend/lts/`) |
| **Time sync** | WorldTimeAPI sync for reliable LTS schedule display |
| **SEO optimized** | Canonical, OG, Twitter Cards, Person + WebSite + FAQPage JSON-LD on all pages |

---

## 🚀 Run / Deploy Instructions

### Local Development (No build step needed)

```bash
# Option 1 — Using npx serve (recommended)
npx serve . -p 3000
# Open: http://localhost:3000

# Option 2 — Python HTTP server
python -m http.server 8000
# Open: http://localhost:8000

# Option 3 — VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> ⚠️ **Do NOT open HTML files directly via `file://`** — the `fetch()` calls for JSON data will fail due to browser CORS restrictions. Always use a local server.

### Deploy to Netlify

```bash
# 1. Push to GitHub
git add .
git commit -m "Update"
git push

# 2. Netlify auto-deploys from the connected GitHub repo
# Site: https://abhinavranjan.netlify.app
```

No build commands needed — Netlify serves the static files directly.

---

## 🔗 External Dependencies

| Service / Library | Usage | Type |
|---|---|---|
| **Netlify** | Hosting & CDN | Cloud |
| **Font Awesome 6.4.0** | All icons (CDN) | CSS Library |
| **Google Fonts — Outfit** | Site-wide typography | Font |
| **WorldTimeAPI** | Time sync for LTS | External API |
| **WhatsApp API** (`wa.me`) | Contact form — WhatsApp | External |
| **Telegram** (`t.me`) | Contact form — Telegram | External |
| **Freepik / External CDNs** | Popup carousel images | External Images |

---

## 🛡️ SEO & Structured Data

Every page has:
- `<title>` (unique, keyword-rich, 50–70 chars)
- `<meta name="description">` (140–160 chars)
- `<link rel="canonical">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card (`summary_large_image`)
- `<h1>` per page

Special schema on:
- **Homepage + About:** `Person` JSON-LD + `WebSite` JSON-LD
- **FAQ page:** `FAQPage` JSON-LD (all 17 Q&As) → enables Google rich snippets

---

## ⚠️ Known Issues / Optimization Points

| Issue | Impact | Fix |
|---|---|---|
| Projects/Socials/Winnings are JS-rendered | Search bots may miss content | Pre-render or use SSG |
| `popup_index.json` loads external images from Freepik/mbagate | May fail (403), CORS | Host images locally |
| `script.js` (legacy) still in `/frontend/logic/` | Codebase clutter | Delete if unused |
| Music popup references audio file path (check if audio hosted) | Broken audio | Verify audio path |
| SW caches `popup_index.json` — not in cache list | Popup offline unavailable | Add to ASSETS_TO_CACHE |
