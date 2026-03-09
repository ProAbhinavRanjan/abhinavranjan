document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 script.js v1.0.3 loaded');
    // Fetch Configuration Data
    const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
    const dataDir = isRoot ? 'frontend/data/' : '../data/';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Decide which data to fetch based on the current page
    let configPromise = fetch(dataDir + 'config.json').then(r => r.json());
    let pageDataPromise = Promise.resolve(null);

    if (currentPage === 'socials.html') {
        pageDataPromise = fetch(dataDir + 'socials_page.json').then(r => r.json());
    } else if (currentPage === 'projects.html') {
        pageDataPromise = fetch(dataDir + 'projects_page.json').then(r => r.json());
    } else if (currentPage === 'winnings.html') {
        pageDataPromise = fetch(dataDir + 'winnings_page.json').then(r => r.json());
    } else if (currentPage === 'biography.html') {
        pageDataPromise = fetch(dataDir + 'biography_page.json').then(r => r.json());
    }

    Promise.all([configPromise, pageDataPromise])
        .then(([config, pageData]) => {
            // Merge pageData if it exists
            const data = { ...config };
            if (pageData) {
                if (currentPage === 'socials.html') data.socials = pageData;
                else if (currentPage === 'projects.html') data.projects = pageData;
                else if (currentPage === 'winnings.html') data.winnings = pageData;
                else if (currentPage === 'biography.html') data.biography = pageData;
            }
            window.siteConfig = data;

            // Populate basic variables via data-var attributes
            document.querySelectorAll('[data-var]').forEach(el => {
                const keys = el.getAttribute('data-var').split('.');
                let val = data;
                for (let k of keys) {
                    if (val) val = val[k];
                }
                if (val !== undefined) {
                    // Update content
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.value = val;
                    } else if (el.tagName === 'A' && el.hasAttribute('href') && el.getAttribute('href') === '#') {
                        el.href = val;
                        // wait, if we specifically want to just set innerHTML
                        el.innerHTML = val;
                    } else {
                        el.innerHTML = val;
                    }
                }
            });

            // Update document title if we are on root
            if (isRoot && data.meta && data.meta.title) {
                document.title = data.meta.title;
            }

            // Render Projects
            const projectsGrid = document.getElementById('dynamicProjectsGrid');
            if (projectsGrid && data.projects) {
                projectsGrid.innerHTML = '';
                data.projects.forEach((proj, index) => {
                    const delay = 200 + (index * 100);
                    let imageHTML = '';
                    if (proj.image === '#') {
                        const patternClass = `gradient-pattern-${(index % 3) + 1}`;
                        imageHTML = `<div class="placeholder-img ${patternClass}"><i class="${proj.icon} project-icon-overlay"></i></div>`;
                    } else if (proj.image) {
                        imageHTML = `<img src="${proj.image}" alt="${proj.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    } else {
                        imageHTML = `<div class="placeholder-img gradient-agroscan"><i class="${proj.icon} project-icon-overlay"></i></div>`;
                    }

                    const tagsHTML = (proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

                    const card = document.createElement('div');
                    card.className = `card project-card fade-in-up delay-${delay}`;
                    card.innerHTML = `
                        <div class="project-image">
                            ${imageHTML}
                        </div>
                        <div class="project-content">
                            <h3>${proj.name}</h3>
                            <p>${proj.description}</p>
                            <div class="tags">
                                ${tagsHTML}
                            </div>
                            <div class="project-links">
                                <a href="${proj.url}" class="btn-text" target="_blank">Launch Project <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    `;
                    projectsGrid.appendChild(card);
                });
                // Register new cards with intersection observer
                if (window.observeNewCards) window.observeNewCards();
            }

            // Render Winnings
            const winningsGrid = document.getElementById('dynamicWinningsGrid');
            if (winningsGrid && data.winnings) {
                winningsGrid.innerHTML = '';
                data.winnings.forEach((win, index) => {
                    const delay = 200 + (index * 100);
                    let imageHTML = '';
                    if (win.image === '#') {
                        const patternClass = `gradient-pattern-${(index % 3) + 1}`;
                        imageHTML = `<div class="placeholder-img ${patternClass}"></div>`;
                    } else if (win.image) {
                        imageHTML = `<img src="${win.image}" alt="${win.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    } else {
                        imageHTML = `<div class="placeholder-img gradient-1"></div>`;
                    }

                    const card = document.createElement('div');
                    card.className = `card winning-card fade-in-up delay-${delay}`;
                    card.style.cursor = 'pointer';
                    // Modal Trigger
                    card.addEventListener('click', () => {
                        const modal = document.getElementById('winningsModal');
                        if (modal) {
                            document.getElementById('modalImageContainer').innerHTML = imageHTML;
                            document.getElementById('modalTitle').innerText = win.title;
                            document.getElementById('modalDescription').innerText = win.description;
                            modal.classList.add('active');
                        }
                    });

                    card.innerHTML = `
                        <div class="winning-image">
                            ${imageHTML}
                        </div>
                        <div class="winning-content">
                            <h3>${win.title}</h3>
                            <p>${win.description.substring(0, 60)}...</p>
                            <div class="tags">
                                <span class="tag">${win.date || 'Award'}</span>
                            </div>
                        </div>
                    `;
                    winningsGrid.appendChild(card);
                });
                // Register new cards with intersection observer
                if (window.observeNewCards) window.observeNewCards();
            }

            // Render Socials
            const socialsGrid = document.getElementById('dynamicSocialsGrid');
            if (socialsGrid && data.socials) {
                socialsGrid.innerHTML = '';
                data.socials.forEach((social, index) => {
                    const delay = 200 + (index * 100);
                    const card = document.createElement('a');
                    card.href = social.url;
                    card.target = '_blank';
                    card.className = `card social-card fade-in-up delay-${delay}`;
                    card.innerHTML = `
                        <div class="card-icon ${social.colorClass || social.platform.toLowerCase()}">
                            <i class="${social.icon}"></i>
                        </div>
                        <div class="card-content">
                            <h3>${social.platform}</h3>
                            <p>${social.handle}</p>
                        </div>
                        <div class="card-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    `;
                    socialsGrid.appendChild(card);
                });
                if (window.observeNewCards) window.observeNewCards();
            }

            // Render Footer (all pages)
            const siteFooter = document.getElementById('siteFooter');
            if (siteFooter && data.footer) {
                const f = data.footer;
                const linksHTML = (f.links || []).map(l =>
                    `<a href="${l.url}">${l.label}</a>`
                ).join('');
                siteFooter.innerHTML = `
                    <div class="container footer-container">
                        <p>&copy; ${f.year} ${f.copyright_name}. All rights reserved.</p>
                        <div class="footer-links">${linksHTML}</div>
                    </div>
                `;
            }

            // Profile Image (About Page)
            const profileImg = document.getElementById('profileImg');
            if (profileImg && data.personal) {
                const imgPath = data.personal.profile_image;
                const base = isRoot ? '' : '../../';

                if (imgPath && imgPath !== '#') {
                    profileImg.src = base + imgPath;
                } else {
                    profileImg.src = base + 'images/arlogo.png';
                }

                profileImg.onerror = () => {
                    profileImg.src = base + 'images/arlogo.png';
                };
            }

            // Modal Close Listeners for Winnings Page
            const closeWinningsModal = document.getElementById('closeModalBtn');
            const winningsModal = document.getElementById('winningsModal');
            if (closeWinningsModal && winningsModal) {
                closeWinningsModal.addEventListener('click', () => {
                    winningsModal.classList.remove('active');
                });
                window.addEventListener('click', (e) => {
                    if (e.target === winningsModal) {
                        winningsModal.classList.remove('active');
                    }
                });
            }

            // Hide loader after a short delay for smooth transition
            setTimeout(() => {
                const loader = document.getElementById('loader-wrapper');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(() => loader.remove(), 600);
                }
            }, 500);
        })
        .catch(err => {
            if (window.location.protocol === 'file:') {
                console.error("🔴 CROSS-ORIGIN ERROR: Modern browsers block 'fetch()' when using 'file://' protocol. Please use 'http://localhost:8090' which is already running in your terminal.");
                // Optionally show a toast for the user
                if (typeof showToast === 'function') showToast("Please use the 'localhost:8090' link (CORS restriction)");
            } else {
                console.error("Error loading config:", err);
            }
        });

    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            if (hamburger && navList) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        }));
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Helper to observe dynamically added elements
    window.observeNewCards = () => {
        document.querySelectorAll('.fade-in-up:not(.observed)').forEach(el => {
            el.classList.add('observed');
            observer.observe(el);
        });
    };

    // 3D Tilt Effect
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Form Handling (WhatsApp Integration)
    // Form Handling (Multi-platform)
    const form = document.getElementById('contactForm');
    if (form) {
        const getFormData = () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            return { name, email, message };
        };

        const sendWhatsappBtn = document.getElementById('sendWhatsapp');
        const sendEmailBtn = document.getElementById('sendEmail');
        const sendTelegramBtn = document.getElementById('sendTelegram');

        if (sendWhatsappBtn) {
            sendWhatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const { name, email, message } = getFormData();
                if (!name || !message) { showToast('Please fill in Name and Message'); return; }

                const phoneNumber = window.siteConfig ? window.siteConfig.contact.whatsapp_number : "8294721929";
                const text = `userName: ${name}%0AuserEmail: ${email || 'Not provided'}%0AuserMessage: ${message}`;
                window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
            });
        }

        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const { name, email, message } = getFormData();
                if (!name || !message) { showToast('Please fill in Name and Message'); return; }

                const emailTo = window.siteConfig ? window.siteConfig.contact.email : "abhinavranjanmit@gmail.com";
                const subject = `New Contact from ${name}`;
                const body = `userName: ${name}%0D%0AuserEmail: ${email || 'Not provided'}%0D%0AuserMessage: ${message}`;
                window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
            });
        }

        if (sendTelegramBtn) {
            sendTelegramBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const { name, email, message } = getFormData();
                if (!name || !message) { showToast('Please fill in Name and Message'); return; }

                const username = window.siteConfig ? window.siteConfig.contact.telegram_username : "abhinav_ranjan";
                const text = `userName: ${name}%0AuserEmail: ${email || 'Not provided'}%0AuserMessage: ${message}`;
                window.open(`https://t.me/${username}?text=${text}`, '_blank');
            });
        }
    }

    // Toast Notification Helper
    function showToast(message) {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.className = "toast show";
        setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Book Live View Modal
    const modal = document.getElementById("bookModal");
    const btn = document.getElementById("liveViewBtn");
    const span = document.getElementsByClassName("close-modal")[0];
    const modalTitle = document.getElementById("modalBookTitle");

    if (btn && modal && span) {
        btn.onclick = function () {
            modal.style.display = "block";
            // Update modal title based on current selection
            const currentTitle = document.getElementById("bookTitle").innerText;
            modalTitle.innerText = currentTitle + " - Preview";
        }

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Book Selection Logic
    const bookSelect = document.getElementById("bookSelect");
    if (bookSelect) {
        const books = {
            book1: {
                title: "The Developer's Mindset",
                desc: "A comprehensive guide to thinking like a programmer. From problem-solving strategies to mastering the art of debugging, this book covers it all.",
                color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            },
            book2: {
                title: "Mastering Modern Web",
                desc: "Deep dive into the latest web technologies, frameworks, and best practices for building scalable applications.",
                color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)"
            },
            book3: {
                title: "The AI Revolution",
                desc: "Understanding the impact of Artificial Intelligence on society and how to leverage it in your projects.",
                color: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
            }
        };

        const bookTitle = document.getElementById("bookTitle");
        const bookTitleDisplay = document.getElementById("bookTitleDisplay");
        const bookDescription = document.getElementById("bookDescription");
        const bookCover = document.getElementById("bookCover");

        bookSelect.addEventListener("change", function (e) {
            const selected = books[e.target.value];

            // Animate out
            const showcase = document.getElementById("bookShowcase");
            showcase.style.opacity = "0";
            showcase.style.transform = "translateY(20px)";

            setTimeout(() => {
                // Update content
                bookTitle.innerText = selected.title;
                bookTitleDisplay.innerText = selected.title;
                bookDescription.innerText = selected.desc;
                bookCover.style.background = selected.color;

                // Animate in
                showcase.style.opacity = "1";
                showcase.style.transform = "translateY(0)";
            }, 300);
        });
    }

    // About Page "Read More" Toggle Logic
    const readMoreBtn = document.getElementById('aboutReadMoreBtn');
    const moreContent = document.getElementById('aboutMoreContent');

    if (readMoreBtn && moreContent) {
        readMoreBtn.addEventListener('click', () => {
            const isActive = moreContent.classList.toggle('active');
            readMoreBtn.classList.toggle('active');

            if (isActive) {
                readMoreBtn.innerHTML = `Read Less <i class="fas fa-chevron-up"></i>`;
            } else {
                readMoreBtn.innerHTML = `Read More <i class="fas fa-chevron-down"></i>`;
                readMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Fallback: hide loader on window load in case fetch fails
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 600);
        }
    });
});
