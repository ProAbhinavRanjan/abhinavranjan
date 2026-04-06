# AR. Blog System Architecture & Documentation

The Blog System is a dynamic, client-side engine designed to host and serve cybersecurity and technology-related articles within the Abhinav Ranjan portfolio.

---

## 📂 File Structure

The blog components are located in `frontend/blogs/` and `frontend/logic/`:

| Path | Purpose |
|---|---|
| `frontend/blogs/blog-index.html` | The main hub for browsing all blog entries. |
| `frontend/blogs/post.html` | The dynamic template used to render any individual blog post. |
| `frontend/blogs/content/*.html` | HTML snippets containing only the raw article body (no headers/footers). |
| `frontend/data/blogs.json` | The central database (title, author, image, path, tags). |
| `frontend/logic/blog_library.js` | The JavaScript engine that orchestrates fetching and SEO. |

---

## ⚙️ Core Logic (`blog_library.js`)

The system operates in **Dual-Mode** depending on the elements present in the DOM:

### 1. Index Mode (`blogGrid`)
- Fetches `blogs.json` and renders "Blog Cards."
- Handles real-time search filtering by Title and Excerpt.
- Manages category-based filtering (Technology, Innovation, Business).

### 2. Post Mode (`postBody`)
- Extracts the `id` from the URL query parameter (`?id=...`).
- Matches the ID against `blogs.json`.
- Fetches the raw HTML snippet from the path defined in `content_path`.
- Injects the snippet into the `#postBody` container.

---

## 🔍 Advanced SEO & Social Discovery

To overcome the limitations of client-side rendering (CSR), the system implements an **Automated SEO Engine** inside the `updateSEO()` function:

### ⚡ JSON-LD Structured Data
The engine dynamically creates a `script[type="application/ld+json"]` block of type `BlogPosting`. This tells search engines:
- The exact **Headline** and **Description**.
- The **Author** and their official profile URL.
- The **Published Date** and **Hero Image**.
- The **Main Entity of Page** (Canonical URL).

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Future of Cybersecurity in 2026",
  "image": ["https://example.com/image.jpg"],
  "datePublished": "2026-03-15T00:00:00.000Z",
  "author": [{
      "@type": "Person",
      "name": "Abhinav Ranjan",
      "url": "https://abhinavranjan.netlify.app"
  }],
  "description": "Exploring the shift from traditional defense...",
  "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://abhinavranjan.netlify.app/frontend/blogs/post?id=future-of-cybersecurity-2026"
  }
}
```


### ⚡ Meta Tag Management
- **Canonical Tags:** Automatically sets `<link rel="canonical">` to the absolute URL.
- **OpenGraph (Facebook/LinkedIn):** Syncs `og:title`, `og:description`, `og:image`, and `og:url`.
- **Twitter Cards:** Syncs `twitter:title`, `twitter:description`, and `twitter:image` for high-impact social shares.

---

## 🛠️ Maintenance Tips

### Adding a New Post
1. Create a raw HTML body in `frontend/blogs/content/your-post-id.html`.
2. Add a new entry to `frontend/data/blogs.json` following the existing schema.
3. The post will automatically appear on the index and become accessible via `post?id=your-post-id`.

### Updating the Blogger Profile
The Blogger profile link is located in the navigation header of `blog-index.html`. Update the link manually at line 109 when the profile ID changes.
