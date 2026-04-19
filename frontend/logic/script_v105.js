document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js v1.1.0 loaded');

    const dataDir = '/frontend/data/';
    const rawPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = rawPage.includes('.') ? rawPage : rawPage + '.html';
    const path = window.location.pathname;

    const isFAQ       = path.includes('asked-questions');
    const isProjects  = currentPage === 'projects.html';
    const isWinnings  = currentPage === 'winnings.html';
    const isBiography = currentPage === 'biography.html';
    const isContact   = currentPage === 'contact.html';
    const isSocials   = currentPage === 'socials.html';
    const isIndex     = (currentPage === 'index.html' || path === '/' || path === '');

    let configPromise   = fetch(dataDir + 'config.json').then(r => r.json());
    let pageDataPromise = Promise.resolve(null);

    if (isSocials)        pageDataPromise = fetch(dataDir + 'socials_page.json').then(r => r.json());
    else if (isProjects)  pageDataPromise = fetch(dataDir + 'projects_page.json').then(r => r.json());
    else if (isWinnings)  pageDataPromise = fetch(dataDir + 'winnings_page.json').then(r => r.json());
    else if (isBiography) pageDataPromise = fetch(dataDir + 'biography_page.json').then(r => r.json());
    else if (isFAQ)       pageDataPromise = fetch(dataDir + 'asked_questions_page.json').then(r => r.json());

    let fetchPromises = [configPromise, pageDataPromise];

    if (isIndex) {
        fetchPromises.push(fetch(dataDir + 'projects_page.json').then(r => r.json()).catch(() => []));
        fetchPromises.push(fetch(dataDir + 'winnings_page.json').then(r => r.json()).catch(() => []));
        fetchPromises.push(fetch(dataDir + 'socials_page.json').then(r => r.json()).catch(() => []));
    }

    Promise.all(fetchPromises)
        .then(([config, pageData, indexProjects, indexWinnings, indexSocials]) => {
            const data = { ...config };
            if (pageData) {
                if (isSocials)        data.socials         = pageData;
                else if (isProjects)  data.projects        = pageData;
                else if (isWinnings)  data.winnings        = pageData;
                else if (isBiography) data.biography       = pageData;
                else if (isFAQ)       data.asked_questions = pageData;
            }
            
            if (isIndex) {
                if (data.projects && indexProjects) {
                    data.projects = data.projects.map(p => {
                        const fullData = indexProjects.find(ip => ip.id === p.id);
                        return fullData ? { ...fullData, ...p } : p;
                    }).filter(p => p.name);
                }
                if (data.winnings && indexWinnings) {
                    data.winnings = data.winnings.map(w => {
                        const fullData = indexWinnings.find(iw => iw.id === w.id);
                        return fullData ? { ...fullData, ...w } : w;
                    }).filter(w => w.title && w.description);
                }
                if (data.socials && indexSocials) {
                    data.socials = data.socials.map(s => {
                        const fullData = indexSocials.find(is => is.id === s.id);
                        return fullData ? { ...fullData, ...s } : s;
                    }).filter(s => s.platform);
                }
            }
            window.siteConfig = data;

            /* 1. data-var → set innerHTML/value */
            document.querySelectorAll('[data-var]').forEach(el => {
                const keys = el.getAttribute('data-var').split('.');
                let val = data;
                for (let k of keys) { if (val != null) val = val[k]; }
                if (val != null && typeof val !== 'object') {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = val;
                    else el.innerHTML = val;
                }
            });

            /* 2. data-link → set href */
            document.querySelectorAll('[data-link]').forEach(el => {
                const keys = el.getAttribute('data-link').split('.');
                let val = data;
                for (let k of keys) { if (val != null) val = val[k]; }
                if (val != null && typeof val === 'string' && val !== '#') el.href = val;
            });

            /* 3. Inject meta keywords from config (centralised per-page) */
            const seoKeys = data.seo && data.seo.keywords;
            if (seoKeys) {
                const pageKey = isProjects ? 'projects' : isWinnings ? 'winnings' : isBiography ? 'biography'
                    : isContact ? 'contact' : isSocials ? 'socials' : isFAQ ? 'faq' : 'home';
                let kw = document.querySelector('meta[name="keywords"]');
                if (!kw) { kw = document.createElement('meta'); kw.name = 'keywords'; document.head.appendChild(kw); }
                kw.content = seoKeys.global + ', ' + (seoKeys[pageKey] || '');
            }

            /* 4. Schema injection helper */
            function injectSchema(obj, id) {
                let el = document.getElementById(id);
                if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; document.head.appendChild(el); }
                el.textContent = JSON.stringify(obj, null, 2);
            }

            const personBase = (data.schema && data.schema.person) ? data.schema.person : {};

            if (isIndex && personBase.name) {
                injectSchema(personBase, 'schemaPersonHome');
                injectSchema({ '@context': 'https://schema.org', '@type': 'WebSite', 'name': 'AR. Abhinav Ranjan', 'url': data.meta.site_url, 'description': data.meta.description }, 'schemaWebSite');
            }
            if (isProjects && data.projects) {
                injectSchema({ '@context': 'https://schema.org', '@type': 'ItemList', 'name': 'Projects by Abhinav Ranjan',
                    'itemListElement': data.projects.map((p,i) => ({ '@type': 'ListItem', 'position': i+1, 'name': p.name, 'description': p.description, 'url': p.url !== '#' ? p.url : data.meta.site_url }))
                }, 'schemaProjectsList');
                injectSchema(personBase, 'schemaPersonProjects');
            }
            if (isWinnings && data.winnings) {
                injectSchema({ '@context': 'https://schema.org', '@type': 'ItemList', 'name': 'Achievements and Awards of Abhinav Ranjan',
                    'itemListElement': data.winnings.map((w,i) => ({ '@type': 'ListItem', 'position': i+1, 'name': w.title, 'description': w.description }))
                }, 'schemaWinningsList');
                injectSchema(personBase, 'schemaPersonWinnings');
            }
            if (isBiography && personBase.name) {
                injectSchema({ '@context': 'https://schema.org', '@type': 'ProfilePage', 'name': 'Biography of Abhinav Ranjan', 'url': data.meta.site_url + '/frontend/html/biography.html', 'mainEntity': personBase }, 'schemaBiography');
            }
            if (isContact && data.contact) {
                injectSchema({ '@context': 'https://schema.org', '@type': 'ContactPage', 'name': 'Contact Abhinav Ranjan', 'url': data.meta.site_url + '/frontend/html/contact.html',
                    'mainEntity': { '@type': 'Person', 'name': personBase.name || 'Abhinav Ranjan', 'email': data.contact.email, 'url': data.meta.site_url }
                }, 'schemaContact');
            }
            if (isSocials && personBase.name) {
                injectSchema({ '@context': 'https://schema.org', '@type': 'ProfilePage', 'name': 'Social Media Handles of Abhinav Ranjan', 'url': data.meta.site_url + '/frontend/html/socials.html', 'mainEntity': personBase }, 'schemaSocials');
            }

            /* 5. Static prerender for bots (visually hidden divs) */
            function injectStaticPrerender(id, items, fn) {
                const el = document.getElementById(id);
                if (el && items) el.innerHTML = items.map(fn).join('');
            }
            if (isProjects && data.projects) {
                injectStaticPrerender('staticProjectsPrerender', data.projects, p =>
                    `<article><h2>${p.name}</h2><p>${p.description}</p><p>Tags: ${(p.tags||[]).join(', ')}</p>${p.url!=='#'?`<a href="${p.url}" rel="noopener">Visit ${p.name}</a>`:''}</article>`);
            }
            if (isWinnings && data.winnings) {
                injectStaticPrerender('staticWinningsPrerender', data.winnings, w =>
                    `<article><h2>${w.title}</h2><p>${w.description}</p><p>Year: ${w.date||''}</p></article>`);
            }

            /* 6. Render Projects grid */
            const projectsGrid = document.getElementById('dynamicProjectsGrid');
            if (projectsGrid && data.projects) {
                projectsGrid.innerHTML = '';
                data.projects.forEach((proj, i) => {
                    const gradients = ['linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)','linear-gradient(135deg,#d946ef,#f43f5e,#f97316)','linear-gradient(135deg,#10b981,#3b82f6,#6366f1)'];
                    const img = (proj.image==='#'||!proj.image) ? `<div class="placeholder-img" style="background:${gradients[i%3]};display:flex;align-items:center;justify-content:center;"><i class="${proj.icon} project-icon-overlay" style="font-size:3rem;opacity:0.2;color:#fff;"></i></div>` : `<img src="${proj.image}" alt="${proj.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`;
                    const tags = (proj.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
                    const card = document.createElement('div');
                    card.className = `card project-card fade-in-up delay-${200+i*100}`;
                    card.innerHTML = `<div class="project-image">${img}</div><div class="project-content"><h3>${proj.name}</h3><p>${proj.description}</p><div class="tags">${tags}</div><div class="project-links"><a href="${proj.url}" class="btn-text" target="_blank" rel="noopener">Launch Project <i class="fas fa-arrow-right"></i></a></div></div>`;
                    projectsGrid.appendChild(card);
                });
                if (window.observeNewCards) window.observeNewCards();
            }

            /* 7. Render Winnings grid */
            const winningsGrid = document.getElementById('dynamicWinningsGrid');
            if (winningsGrid && data.winnings) {
                winningsGrid.innerHTML = '';
                data.winnings.forEach((win, i) => {
                    const gradients = ['linear-gradient(135deg,#ff9a9e,#fad0c4)','linear-gradient(120deg,#a1c4fd,#c2e9fb)','linear-gradient(135deg,#667eea,#764ba2)'];
                    const img = (win.image==='#'||!win.image) ? `<div class="placeholder-img" style="background:${gradients[i%3]}"></div>` : `<img src="${win.image}" alt="${win.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`;
                    const card = document.createElement('div');
                    card.className = `card winning-card fade-in-up delay-${200+i*100}`;
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        const modal = document.getElementById('winningsModal');
                        if (modal) { document.getElementById('modalImageContainer').innerHTML = img; document.getElementById('modalTitle').innerText = win.title; document.getElementById('modalDescription').innerText = win.description; modal.classList.add('active'); }
                    });
                    card.innerHTML = `<div class="winning-image">${img}</div><div class="winning-content"><h3>${win.title}</h3><p>${win.description.substring(0,60)}...</p><div class="tags"><span class="tag">${win.date||'Award'}</span></div></div>`;
                    winningsGrid.appendChild(card);
                });
                if (window.observeNewCards) window.observeNewCards();
            }

            /* 8. Render FAQ */
            if (isFAQ && data.asked_questions) {
                const faqs = data.asked_questions.faqs || [];
                const jsonLdEl = document.getElementById('faqJsonLd');
                if (jsonLdEl && faqs.length > 0) {
                    jsonLdEl.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': faqs.map(f => ({ '@type': 'Question', 'name': f.question, 'acceptedAnswer': { '@type': 'Answer', 'text': f.answer } })) }, null, 2);
                }
                const prerender = document.getElementById('staticFaqPrerender');
                if (prerender && faqs.length > 0) {
                    const dl = document.createElement('dl');
                    faqs.forEach(f => { const dt = document.createElement('dt'); dt.textContent = f.question; const dd = document.createElement('dd'); dd.textContent = f.answer; dl.appendChild(dt); dl.appendChild(dd); });
                    prerender.appendChild(dl);
                }
                const aboutTextEl = document.getElementById('faqAboutText');
                if (aboutTextEl && data.asked_questions.about_text) aboutTextEl.innerText = data.asked_questions.about_text;
                const faqAccordion = document.getElementById('dynamicFaqAccordion');
                if (faqAccordion && faqs.length > 0) {
                    faqAccordion.innerHTML = '';
                    faqs.forEach(faq => {
                        const item = document.createElement('div'); item.className = 'faq-item';
                        item.innerHTML = `<button class="faq-question"><span>${faq.question}</span><i class="fas fa-plus faq-icon"></i></button><div class="faq-answer"><p>${faq.answer}</p></div>`;
                        faqAccordion.appendChild(item);
                    });
                    const noResults = document.createElement('div'); noResults.className = 'no-results-message'; noResults.id = 'faqNoResults'; noResults.innerHTML = `<i class="fas fa-search"></i><p>No questions found matching your search.</p>`;
                    faqAccordion.parentNode.insertBefore(noResults, faqAccordion.nextSibling);
                    const searchInput = document.getElementById('faqSearchInput');
                    if (searchInput) {
                        searchInput.addEventListener('input', e => {
                            const term = e.target.value.toLowerCase().trim();
                            let hasResults = false;
                            faqAccordion.querySelectorAll('.faq-item').forEach(item => {
                                const show = item.querySelector('.faq-question span').innerText.toLowerCase().includes(term) || item.querySelector('.faq-answer p').innerText.toLowerCase().includes(term);
                                item.style.display = show ? 'block' : 'none'; if (show) hasResults = true;
                            });
                            noResults.style.display = hasResults ? 'none' : 'block';
                        });
                    }
                    document.querySelectorAll('.faq-question').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const item = btn.parentElement; const isActive = item.classList.contains('active');
                            document.querySelectorAll('.faq-item').forEach(f => { f.classList.remove('active'); const a = f.querySelector('.faq-answer'); if (a) a.style.maxHeight = null; });
                            if (!isActive) { item.classList.add('active'); const a = item.querySelector('.faq-answer'); if (a) a.style.maxHeight = a.scrollHeight + 'px'; }
                        });
                    });
                }
                const faqProfileImg = document.getElementById('faqProfileImg');
                if (faqProfileImg) { const ip = data.asked_questions && data.asked_questions.image_url; faqProfileImg.src = (ip && ip !== '#') ? '/' + ip : '/images/arlogo.png'; faqProfileImg.onerror = () => { faqProfileImg.src = '/images/arlogo.png'; }; }
            }

            /* 9. Render Socials */
            const socialsGrid = document.getElementById('dynamicSocialsGrid');
            if (socialsGrid && data.socials) {
                socialsGrid.innerHTML = '';
                data.socials.forEach((social, i) => {
                    const card = document.createElement('a'); card.href = social.url; card.target = '_blank'; card.rel = 'noopener noreferrer'; card.className = `card social-card fade-in-up delay-${200+i*100}`;
                    card.innerHTML = `<div class="card-icon ${social.colorClass||social.platform.toLowerCase()}"><i class="${social.icon}"></i></div><div class="card-content"><h3>${social.platform}</h3><p>${social.handle}</p></div><div class="card-arrow"><i class="fas fa-arrow-right"></i></div>`;
                    socialsGrid.appendChild(card);
                });
                if (window.observeNewCards) window.observeNewCards();
            }

            /* 10. Render Footer */
            const siteFooter = document.getElementById('siteFooter');
            if (siteFooter && data.footer) {
                const f = data.footer;
                siteFooter.innerHTML = `<div class="container footer-container"><p>&copy; ${f.year} ${f.copyright_name}. All rights reserved.</p><div class="footer-links">${(f.links||[]).map(l=>`<a href="${l.url}">${l.label}</a>`).join('')}</div></div>`;
            }

            /* 11. Profile image */
            const profileImg = document.getElementById('profileImg');
            if (profileImg && data.personal) { const ip = data.personal.profile_image; profileImg.src = (ip&&ip!=='#') ? '/'+ip : '/images/arlogo.png'; profileImg.onerror = () => { profileImg.src = '/images/arlogo.png'; }; }

            /* 12. Winnings modal close */
            const closeBtn = document.getElementById('closeModalBtn'); const winModal = document.getElementById('winningsModal');
            if (closeBtn && winModal) { closeBtn.addEventListener('click', () => winModal.classList.remove('active')); window.addEventListener('click', e => { if (e.target === winModal) winModal.classList.remove('active'); }); }

            /* Hide loader */
            setTimeout(() => { const l = document.getElementById('loader-wrapper'); if (l) { l.classList.add('fade-out'); setTimeout(() => l.remove(), 600); } }, 500);
        })
        .catch(err => {
            console.error('Config load error:', err);
            const l = document.getElementById('loader-wrapper');
            if (l) { l.classList.add('fade-out'); setTimeout(() => l.remove(), 600); }
        });

    /* Mobile Menu */
    const hamburger = document.getElementById('hamburger'); const navList = document.querySelector('.nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navList.classList.toggle('active'); });
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => { hamburger.classList.remove('active'); navList.classList.remove('active'); }));
    }

    /* Scroll Animations */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    window.observeNewCards = () => { document.querySelectorAll('.fade-in-up:not(.observed)').forEach(el => { el.classList.add('observed'); observer.observe(el); }); };

    /* 3D Tilt */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); card.style.transform = `perspective(1000px) rotateX(${(((e.clientY-r.top)/r.height)-0.5)*-10}deg) rotateY(${(((e.clientX-r.left)/r.width)-0.5)*10}deg)`; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; });
    });

    /* Contact form logic has been decoupled to contact_handler.js */

    /* Toast */
    function showToast(msg) { let t=document.getElementById('toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);} t.innerText=msg; t.className='toast show'; setTimeout(()=>{t.className=t.className.replace('show','');},3000); }

    /* Active nav */
    const cp = window.location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.nav-link').forEach(l => { if(l.getAttribute('href')===cp) l.classList.add('active'); });

    /* Read More toggle */
    const rmb = document.getElementById('aboutReadMoreBtn'); const mc = document.getElementById('aboutMoreContent');
    if (rmb && mc) { rmb.addEventListener('click', () => { const a=mc.classList.toggle('active'); rmb.classList.toggle('active'); rmb.innerHTML=a?'Read Less <i class="fas fa-chevron-up"></i>':'Read More <i class="fas fa-chevron-down"></i>'; if(!a) rmb.scrollIntoView({behavior:'smooth',block:'center'}); }); }

    /* Fallback loader */
    window.addEventListener('load', () => { const l=document.getElementById('loader-wrapper'); if(l&&!l.classList.contains('fade-out')){l.classList.add('fade-out');setTimeout(()=>l.remove(),600);} });
});
