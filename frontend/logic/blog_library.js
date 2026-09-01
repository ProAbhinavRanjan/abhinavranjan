/**
 * blog_library.js — Dynamic Blog Engine for AR. Portal
 * ===================================================
 * Handles fetching, filtering, and SEO automation for the blog system.
 */

(async function () {
    const BLOG_DATA_URL = '/frontend/data/blogs.json';
    let ALL_POSTS = [];

    async function init() {
        try {
            const response = await fetch(BLOG_DATA_URL);
            if (!response.ok) throw new Error('Failed to load blog database');
            ALL_POSTS = await response.json();
            
            // Check if we are on the index or a post page
            if (document.getElementById('blogGrid')) {
                renderBlogIndex(ALL_POSTS);
                setupFilters();
            } else if (document.getElementById('postBody')) {
                renderSinglePost();
            }
        } catch (error) {
            console.error('🔴 Blog Engine Error:', error);
            if (document.getElementById('blogGrid')) {
                document.getElementById('blogGrid').innerHTML = '<p class="error">Unable to load blogs. Please try again later.</p>';
            }
        }
    }

    // ── INDEX PAGE LOGIC ───────────────────────────────────────────────────

    function renderBlogIndex(posts) {
        const grid = document.getElementById('blogGrid');
        const stats = document.getElementById('blogStats');
        if (!grid) return;

        if (stats) {
            stats.innerText = `Showing ${posts.length} of ${ALL_POSTS.length} articles`;
        }

        if (posts.length === 0) {
            grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-muted);">No articles found matching your query.</div>';
            return;
        }

        grid.innerHTML = posts.map(post => `
            <a href="/frontend/blogs/${post.slug}.html" class="blog-card fade-in-up">
                <div class="blog-card-img">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-card-content">
                    <span class="blog-date">${post.date}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-card-footer">
                        <span class="read-more">Read Publication <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </a>
        `).join('');

        if (window.observeNewCards) {
            window.observeNewCards();
        } else {
            document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
        }
    }

    function setupFilters() {
        const searchInput = document.getElementById('blogSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const filtered = ALL_POSTS.filter(p => 
                    (p.title || '').toLowerCase().includes(term) || 
                    (p.excerpt || '').toLowerCase().includes(term) ||
                    (p.tags || []).some(t => t.toLowerCase().includes(term))
                );
                renderBlogIndex(filtered);
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category;
                const filtered = cat === 'all' ? ALL_POSTS : ALL_POSTS.filter(p => p.category.toLowerCase() === cat.toLowerCase());
                renderBlogIndex(filtered);
            });
        });
    }

    // ── SINGLE POST LOGIC ──────────────────────────────────────────────────

    async function renderSinglePost() {
        // Extract slug from the filename (e.g., past-life.html)
        const pathSegments = window.location.pathname.split('/');
        const fileName = pathSegments[pathSegments.length - 1];
        const slug = fileName.replace('.html', '').replace('.htm', '');
        const post = ALL_POSTS.find(p => p.slug === slug || p.id === slug);

        if (!post) {
            console.warn('⚠️ Blog post not found for slug:', slug, 'Available posts:', ALL_POSTS.length);
            // Redirect to the index page for graceful fallback
            window.location.href = '/frontend/blogs/index.html';
            return;
        }

        // 1. Update SEO Meta Tags (Automation)
        updateSEO(post);

        // 2. Render Header Info
        document.getElementById('postTitle').innerText = post.title;
        document.getElementById('postDate').innerText = post.date;
        document.getElementById('postAuthor').innerText = `By ${post.author}`;
        document.getElementById('postHero').style.backgroundImage = `url(${post.image})`;

        // 3. Fetch and Inject Content
        try {
            const contentFileName = post.content_path.split('/').pop();
            const contentResp = await fetch(`/frontend/blogs/content/${contentFileName}`);
            if (!contentResp.ok) throw new Error('Content file not found');
            const html = await contentResp.text();
            document.getElementById('postBody').innerHTML = html;
        } catch (e) {
            document.getElementById('postBody').innerHTML = '<p class="error">Content is currently unavailable.</p>';
        }
    }

    function updateSEO(post) {
        const siteUrl = "https://abhinavranjan.qzz.io";
        // Use clean URL structure for SEO
        const postUrl = `${siteUrl}/frontend/blogs/${post.slug}.html`;
        
        document.title = `${post.title} | AR. Blogs`;
        
        // 1. Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = post.excerpt;

        // 2. Update Canonical Tag
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = postUrl;

        // 3. Update Social Meta Tags (OpenGraph & Twitter)
        const socialTags = {
            'og:title': post.title,
            'og:description': post.excerpt,
            'og:image': post.image,
            'og:url': postUrl,
            'twitter:title': post.title,
            'twitter:description': post.excerpt,
            'twitter:image': post.image
        };

        for (const [prop, val] of Object.entries(socialTags)) {
            let el = prop.startsWith('og:') 
                ? document.querySelector(`meta[property="${prop}"]`)
                : document.querySelector(`meta[name="${prop}"]`);
            
            if (!el) {
                el = document.createElement('meta');
                if (prop.startsWith('og:')) {
                    el.setAttribute('property', prop);
                } else {
                    el.name = prop;
                }
                document.head.appendChild(el);
            }
            el.content = val;
        }

        // 4. Inject JSON-LD Structured Data
        injectStructuredData(post, postUrl);
    }

    function injectStructuredData(post, postUrl) {
        // Remove existing JSON-LD for blogs to avoid duplicates
        const existingScript = document.getElementById('blog-json-ld');
        if (existingScript) existingScript.remove();

        let dateIso = new Date().toISOString();
        try {
            if (post.date) {
                const parsedDate = new Date(post.date);
                if (!isNaN(parsedDate.getTime())) {
                    dateIso = parsedDate.toISOString();
                }
            }
        } catch (e) {
            console.warn("Date parsing fallback:", e);
        }

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.image],
            "datePublished": dateIso,
            "dateModified": post.dateModified ? new Date(post.dateModified).toISOString() : dateIso,
            "author": [{
                "@type": "Person",
                "name": post.author,
                "url": "https://abhinavranjan.qzz.io"
            }],
            "publisher": {
                "@type": "Organization",
                "name": "Luminary Technicals",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://abhinavranjan.qzz.io/images/arlogo.png"
                }
            },
            "description": post.excerpt,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'blog-json-ld';
        script.text = JSON.stringify(jsonLd);
        document.head.appendChild(script);
    }

    init();
})();
