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
            const grid = document.getElementById('blogGrid');
            if (grid) grid.innerHTML = '<p class="error">Unable to load blogs. Please try again later.</p>';
        }
    }

    // ── INDEX PAGE LOGIC ───────────────────────────────────────────────────

    function renderBlogIndex(posts) {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;

        if (posts.length === 0) {
            grid.innerHTML = '<div class="empty-state">No stories found matching your criteria.</div>';
            return;
        }

        grid.innerHTML = posts.map(post => `
            <a href="post?id=${post.id}" class="blog-card fade-in-up">
                <div class="blog-card-img">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-card-content">
                    <span class="blog-date">${post.date}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-card-footer">
                        <span class="read-more">Read Entry <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    function setupFilters() {
        const searchInput = document.getElementById('blogSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = ALL_POSTS.filter(p => 
                    (p.title || '').toLowerCase().includes(term) || 
                    (p.excerpt || '').toLowerCase().includes(term)
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
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const post = ALL_POSTS.find(p => p.id === postId);

        if (!post) {
            window.location.href = 'blog-index.html';
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
            const contentResp = await fetch(`/${post.content_path}`);
            if (!contentResp.ok) throw new Error('Content file not found');
            const html = await contentResp.text();
            document.getElementById('postBody').innerHTML = html;
        } catch (e) {
            document.getElementById('postBody').innerHTML = '<p class="error">Content is currently unavailable.</p>';
        }
    }

    function updateSEO(post) {
        const siteUrl = "https://abhinavranjan.netlify.app";
        const postUrl = `${siteUrl}/frontend/blogs/post?id=${post.id}`;
        
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

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.image],
            "datePublished": new Date(post.date).toISOString() || new Date().toISOString(),
            "author": [{
                "@type": "Person",
                "name": post.author,
                "url": "https://abhinavranjan.netlify.app"
            }],
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
