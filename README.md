<div align="center">
  <img src="images/arlogo.png" alt="AR Logo" width="120" />
  
  <h1>AR. Abhinav Ranjan — Personal Portfolio</h1>
  
  <p>
    <strong>Official digital home of AR. Abhinav Ranjan (itzmeabhinavranjan)</strong><br>
    <em>Cybersecurity Educator • Infrastructure Architect • Founder of Luminary Technicals</em>
  </p>

  <p>
    <a href="https://abhinavranjan.qzz.io"><b>🌐 View Live Site</b></a> •
    <a href="frontend/html/glossary.html"><b>📖 Ecosystem Glossary</b></a> •
    <a href="frontend/gallery/index.html"><b>🏆 Authority Archive</b></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Type-Static%20Website-blue?style=for-the-badge" alt="Type" />
    <img src="https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML%20%7C%20CSS-orange?style=for-the-badge" alt="Stack" />
    <img src="https://img.shields.io/badge/Deployment-Netlify%20CDN-success?style=for-the-badge" alt="Deployment" />
  </p>
</div>

<hr>

## 🧑‍💻 About the Project

This is the official personal portfolio of **AR. Abhinav Ranjan** — a young cybersecurity educator, ethical hacking teacher, and founder of **Luminary Technicals** from Muzaffarpur, Bihar, India, recognized by Guinness World Records and the Golden Book of World Records. Developed by **Luminary Developers**.

The site is a **data-driven, multi-page static portfolio** with no build step — all content is loaded dynamically from JSON files at runtime. It supports offline access via a Service Worker (PWA), has a custom popup announcement system, fully featured FAQ and biography modules, and a newly integrated modern glossary. 

It features state-of-the-art Search, Answer, and Generative Engine Optimizations (SEO/AEO/GEO) including robust JSON-LD structured schemas (`Person`, `WebSite`, `FAQPage`, `PodcastSeries`, `ContactPage`, `BreadcrumbList`, `SoftwareApplication`, and `CollectionPage`) for maximum visibility on AI tools and standard search engines.

<hr>

## ✨ Major Features & New Updates

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Data-driven content</b></td>
      <td>All projects, socials, winnings, FAQ rendered from JSON via <code>fetch()</code> with proper <code>.catch()</code> fallbacks.</td>
    </tr>
    <tr>
      <td><b>Ecosystem Glossary (NEW)</b></td>
      <td>Dedicated glossary featuring 105+ terms across Cybersecurity, Web Dev, Hosting, AI, and Luminary ecosystem, fully responsive with live search.</td>
    </tr>
    <tr>
      <td><b>Strict Canonical & SEO (NEW)</b></td>
      <td>All titles, meta descriptions, canonical URLs, and Open Graph / Twitter Cards are rigorously configured for optimal crawling and AI ingestion.</td>
    </tr>
    <tr>
      <td><b>PWA / Offline</b></td>
      <td>Service Worker (cache-first), manifest, offline fallback page. Verified robust handling of offline arrays.</td>
    </tr>
    <tr>
      <td><b>Popup announcement system</b></td>
      <td>Multi-section modal carousel driven by <code>popup_index.json</code>.</td>
    </tr>
    <tr>
      <td><b>Contact multi-platform</b></td>
      <td>Form sends to WhatsApp, Email, or Telegram from config with dynamic ContactPage schema.</td>
    </tr>
    <tr>
      <td><b>LTS Platform & Sync</b></td>
      <td>Separate live podcast/telecast server interface (<code>/frontend/lts/</code>) with WorldTimeAPI sync.</td>
    </tr>
  </tbody>
</table>

<hr>

## 🚀 Run / Deploy Instructions

### Local Development (No build step needed)

<pre><code># Option 1 — Using npx serve (recommended)
npx serve . -p 3000

# Option 2 — Python HTTP server
python -m http.server 8000
</code></pre>

> [!WARNING]
> **Do NOT open HTML files directly via `file://`** — the `fetch()` calls for JSON data will fail due to browser CORS restrictions. Always use a local server.

### Deploy to Netlify

<pre><code>git add .
git commit -m "Update"
git push
</code></pre>

Netlify auto-deploys from the connected GitHub repo directly serving the static files.

<hr>

## 🛡️ SEO & Structured Data

Every page has:
<ul>
  <li><code>&lt;title&gt;</code> fully populated across all pages including edge cases.</li>
  <li><code>&lt;meta name="description"&gt;</code> (140–160 chars)</li>
  <li><code>&lt;link rel="canonical"&gt;</code> pointing precisely to <code>https://abhinavranjan.qzz.io/</code> to prevent duplicate indexing issues.</li>
  <li>Open Graph tags & Twitter Cards properly scoped (<code>@i_abhinavranjanan</code>).</li>
</ul>

### Brand Consistency
The brand standard for naming across the ecosystem strictly enforces spaces after periods for titles:
- **AR. Abhinav Ranjan**
- **AR. Tech**
- **DEV. AR.**

<hr>

<div align="center">
  <p>© 2026 <b>Luminary Developers</b> | Engineered for Resilience</p>
</div>
