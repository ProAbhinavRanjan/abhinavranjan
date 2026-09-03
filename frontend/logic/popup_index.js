// ─────────────────────────────────────────────────────────────────────────────
//  POPUP RENDERER — Fetches data from popup_index.json
//  Session-Aware (1-time per session) & Mobile-Responsive
// ─────────────────────────────────────────────────────────────────────────────

(async function () {
    const POPUP_SESSION_KEY = 'ar_popup_seen_session';

    // 1. Session Storage Check: If already viewed/dismissed in this session, do not show again on back navigation
    if (sessionStorage.getItem(POPUP_SESSION_KEY)) {
        return;
    }

    let POPUP_CONFIG;

    try {
        const response = await fetch(`/frontend/data/popup_index.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load popup config');
        POPUP_CONFIG = await response.json();
    } catch (error) {
        console.error('🔴 Popup Error:', error);
        return;
    }

    if (!POPUP_CONFIG || !POPUP_CONFIG.enabled) return;

    const activeSections = (POPUP_CONFIG.sections || []).filter(s => s.active);
    if (activeSections.length === 0) return;

    // Mark as shown for the current browser session
    sessionStorage.setItem(POPUP_SESSION_KEY, 'true');

    let currentSection = 0;
    let autoplayTimers = {};

    function buildCarousel(section, containerId) {
        if (!section.images || section.images.length === 0) return '';

        const sizeMap = {
            small: '100px',
            medium: '180px',
            large: '260px',
            full: '100%'
        };
        const imgHeight = sizeMap[section.imageSize] || '180px';

        const slides = section.images.map((src, i) => `
            <div class="pi-slide${i === 0 ? ' pi-active' : ''}" data-index="${i}" style="display:${i === 0 ? 'block' : 'none'};">
                <img src="${src}" alt="Slide ${i + 1}" style="width:100%;height:${imgHeight};object-fit:contain;border-radius:10px;display:block;background:rgba(0,0,0,0.3);" onerror="this.style.display='none'">
            </div>
        `).join('');

        const dots = section.images.length > 1 ? `
            <div class="pi-dots" style="text-align:center;margin-top:8px;">
                ${section.images.map((_, i) => `<span class="pi-dot${i === 0 ? ' pi-dot-active' : ''}" data-dot="${i}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${i === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.2)'};margin:0 3px;cursor:pointer;transition:background .3s;"></span>`).join('')}
            </div>` : '';

        return `<div class="pi-carousel" id="${containerId}" style="margin-bottom:12px;">${slides}${dots}</div>`;
    }

    function goToSlide(carouselEl, index) {
        const slides = carouselEl.querySelectorAll('.pi-slide');
        const dots = carouselEl.querySelectorAll('.pi-dot');
        slides.forEach((s, i) => {
            s.style.display = i === index ? 'block' : 'none';
            s.classList.toggle('pi-active', i === index);
        });
        dots.forEach((d, i) => {
            d.style.background = i === index ? 'var(--primary)' : 'rgba(255,255,255,0.2)';
            d.classList.toggle('pi-dot-active', i === index);
        });
    }

    function startAutoplay(section, carouselEl) {
        if (!section.autoplay || section.images.length <= 1) return;
        let current = 0;
        autoplayTimers[section.id] = setInterval(() => {
            current = (current + 1) % section.images.length;
            goToSlide(carouselEl, current);
        }, section.autoplayInterval || 3000);
    }

    function buildPopup() {
        // Double check session in case another event fired
        if (document.getElementById('piOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'piOverlay';
        overlay.style.cssText = `
            position:fixed;inset:0;background:rgba(0,0,0,0.78);backdrop-filter:blur(10px);
            -webkit-backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;
            justify-content:center;padding:1rem;animation:piFadeIn .35s ease;
        `;

        const box = document.createElement('div');
        box.id = 'piBox';
        box.style.cssText = `
            background:linear-gradient(135deg,rgba(18,18,30,0.98),rgba(12,12,22,0.98));
            border:1px solid rgba(99,102,241,0.35);border-radius:20px;
            max-width:520px;width:100%;max-height:88vh;overflow-y:auto;
            box-shadow:0 30px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(99,102,241,0.2);
            animation:piSlideUp .4s cubic-bezier(.34,1.56,.64,1);
            font-family:'Outfit',sans-serif;color:#fff;box-sizing:border-box;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display:flex;justify-content:space-between;align-items:center;
            padding:1.1rem 1.4rem 0.8rem;border-bottom:1px solid rgba(255,255,255,0.08);
            gap:0.75rem;
        `;
        header.innerHTML = `
            <div style="display:flex;gap:.4rem;align-items:center;flex-wrap:wrap;">
                ${activeSections.map((s, i) => `
                    <button class="pi-tab" data-tab="${i}" style="
                        border:none;cursor:pointer;padding:.4rem .85rem;border-radius:30px;font-size:.8rem;
                        font-family:inherit;font-weight:600;transition:all .25s;
                        background:${i === 0 ? 'var(--gradient-primary,linear-gradient(135deg,#6366f1,#8b5cf6))' : 'rgba(255,255,255,0.08)'};
                        color:${i === 0 ? '#fff' : 'rgba(255,255,255,0.6)'};
                    ">${i + 1}</button>
                `).join('')}
            </div>
            <button id="piClose" aria-label="Close Announcement" style="
                border:none;cursor:pointer;background:rgba(255,255,255,0.1);
                color:#fff;width:34px;height:34px;border-radius:50%;font-size:1rem;
                display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;
            ">✕</button>
        `;

        // Content area
        const contentArea = document.createElement('div');
        contentArea.id = 'piContent';
        contentArea.style.cssText = 'padding:1.4rem;box-sizing:border-box;';

        box.appendChild(header);
        box.appendChild(contentArea);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // inject keyframes & responsive styling
        const style = document.createElement('style');
        style.textContent = `
            @keyframes piFadeIn { from{opacity:0} to{opacity:1} }
            @keyframes piSlideUp { from{opacity:0;transform:scale(.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
            #piBox::-webkit-scrollbar { width:4px }
            #piBox::-webkit-scrollbar-thumb { background:rgba(99,102,241,.5);border-radius:4px }
            .pi-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.6rem;
                margin-top: 0.2rem;
                margin-bottom: 0.25rem;
                flex-wrap: wrap;
            }
            .pi-title {
                font-size: 1.12rem;
                font-weight: 700;
                margin: 0 !important;
                line-height: 1.35;
                color: #fff;
                flex: 1 1 auto;
            }
            .pi-date-badge {
                font-size: 0.75rem;
                font-weight: 600;
                color: #c7d2fe;
                background: rgba(99,102,241,0.22);
                border: 1px solid rgba(99,102,241,0.38);
                padding: 0.2rem 0.65rem;
                border-radius: 20px;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                margin: 0 !important;
                flex-shrink: 0;
            }
            .pi-desc {
                color: rgba(255,255,255,.72);
                line-height: 1.55;
                font-size: 0.92rem;
                margin: 0.35rem 0 1rem 0 !important;
            }
            @media (max-width: 480px) {
                #piBox {
                    max-width: calc(100vw - 24px) !important;
                    border-radius: 16px !important;
                }
                #piContent {
                    padding: 1rem !important;
                }
                .pi-title {
                    font-size: 1.02rem !important;
                }
                .pi-header-row {
                    gap: 0.4rem !important;
                    margin-bottom: 0.2rem !important;
                }
            }
        `;
        document.head.appendChild(style);

        function renderSection(index) {
            currentSection = index;
            const section = activeSections[index];
            const carouselId = `pi-carousel-${section.id}`;

            const buttonsHTML = (section.buttons || []).map(b => `
                <a href="${b.url}" style="
                    display:inline-block;padding:.65rem 1.4rem;border-radius:50px;font-size:.88rem;
                    font-family:inherit;font-weight:600;text-decoration:none;margin:.35rem;
                    background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
                    box-shadow:0 4px 15px rgba(99,102,241,.35);transition:transform .2s,box-shadow .2s;
                " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 25px rgba(99,102,241,.5)'"
                   onmouseout="this.style.transform='';this.style.boxShadow='0 4px 15px rgba(99,102,241,.35)'"
                >${b.label}</a>
            `).join('');

            contentArea.innerHTML = `
                ${buildCarousel(section, carouselId)}
                <div class="pi-header-row">
                    <h3 class="pi-title">${section.name}</h3>
                    <span class="pi-date-badge">
                        <i class="far fa-calendar-alt" style="font-size:.72rem;opacity:.9;"></i> ${section.date}
                    </span>
                </div>
                <p class="pi-desc">${section.paragraph}</p>
                ${buttonsHTML ? `<div style="text-align:center;margin-top:.4rem;">${buttonsHTML}</div>` : ''}
            `;

            // Wire up dots
            const carouselEl = document.getElementById(carouselId);
            if (carouselEl) {
                carouselEl.querySelectorAll('.pi-dot').forEach(dot => {
                    dot.addEventListener('click', () => {
                        clearInterval(autoplayTimers[section.id]);
                        goToSlide(carouselEl, parseInt(dot.dataset.dot));
                    });
                });
                startAutoplay(section, carouselEl);
            }

            // Update tab styles
            document.querySelectorAll('.pi-tab').forEach((t, i) => {
                t.style.background = i === index
                    ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                    : 'rgba(255,255,255,0.08)';
                t.style.color = i === index ? '#fff' : 'rgba(255,255,255,0.6)';
            });
        }

        // Events
        document.getElementById('piClose').addEventListener('click', () => {
            Object.values(autoplayTimers).forEach(clearInterval);
            overlay.style.animation = 'piFadeIn .25s ease reverse';
            setTimeout(() => overlay.remove(), 250);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) document.getElementById('piClose').click();
        });

        document.querySelectorAll('.pi-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                Object.values(autoplayTimers).forEach(clearInterval);
                autoplayTimers = {};
                renderSection(parseInt(tab.dataset.tab));
            });
        });

        renderSection(0);
    }

    setTimeout(buildPopup, POPUP_CONFIG.showDelay || 1500);
})();
