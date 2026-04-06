// ===== BIOGRAPHY PAGE: BOOKS LIBRARY + PODCAST =====
// All data is loaded from frontend/data/biography_page.json

document.addEventListener('DOMContentLoaded', () => {
    // Resolve data path (works from /frontend/html/ subdirectory)
    const dataPath = '../data/biography_page.json';

    fetch(dataPath)
        .then(r => r.json())
        .then(biographyData => {
            initBooksLibrary(biographyData.books || []);
            initPodcast(biographyData.podcast || null);
        })
        .catch(err => {
            console.error('Failed to load biography_page.json:', err);
        });

    // =============================================
    // BOOKS LIBRARY
    // =============================================
    function initBooksLibrary(booksData) {
        // Update books count badge dynamically
        const booksCountEl = document.querySelector('.books-count');
        if (booksCountEl) {
            booksCountEl.textContent = `${booksData.length} Book${booksData.length !== 1 ? 's' : ''}`;
        }

        const panel = document.getElementById('sidePanel');
        const overlay = document.getElementById('panelOverlay');
        const openBtn = document.getElementById('openBooksLibrary');
        const closeBtn = document.getElementById('panelCloseBtn');
        const downloadBtn = document.getElementById('panelDownloadBtn');
        const panelTitle = document.getElementById('panelBookTitle');
        const booksList = document.getElementById('booksList');
        const searchInput = document.getElementById('bookSearch');
        const pdfContainer = document.getElementById('pdfContainer');
        const mobileDropdown = document.getElementById('mobileDropdown');

        if (!panel || !openBtn) return;

        let currentBook = null;
        let filteredBooks = [...booksData];

        // Render book list in sidebar
        const renderBooks = (books) => {
            booksList.innerHTML = books.map(book => `
                <div class="book-item" data-book-id="${book.id}">
                    <div class="book-cover" style="background: ${book.gradient}">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="book-info">
                        <h4>${book.title}</h4>
                        <p>${book.subtitle}</p>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.book-item').forEach(item => {
                item.addEventListener('click', () => selectBook(item.dataset.bookId, booksData));
            });
        };

        // Render mobile dropdown
        const renderMobileDropdown = (books) => {
            mobileDropdown.innerHTML = books.map(book => `
                <div class="dropdown-item ${currentBook?.id === book.id ? 'active' : ''}" data-book-id="${book.id}">
                    <h4>${book.title}</h4>
                    <p>${book.subtitle}</p>
                </div>
            `).join('');

            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    selectBook(item.dataset.bookId, booksData);
                    toggleMobileDropdown();
                });
            });
        };

        // Select a book and show preview
        const selectBook = (bookId, books) => {
            const book = books.find(b => b.id === bookId);
            if (!book) return;

            currentBook = book;

            document.querySelectorAll('.book-item').forEach(item => {
                item.classList.toggle('active', item.dataset.bookId === bookId);
            });

            panelTitle.textContent = book.title;
            downloadBtn.style.display = 'flex';

            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = book.pdfUrl;
                link.target = '_blank';
                link.download = book.pdfUrl.split('/').pop() || 'download.pdf';
                link.click();
            };

            if (book.pdfUrl && book.pdfUrl !== '#') {
                pdfContainer.innerHTML = `<iframe src="${book.pdfUrl}" frameborder="0"></iframe>`;
            } else {
                pdfContainer.innerHTML = `
                    <div class="pdf-info">
                        <i class="fas fa-file-pdf" style="font-size: 4rem; color: var(--primary); margin-bottom: 1.5rem;"></i>
                        <h3>${book.title}</h3>
                        <p style="color: var(--text-muted); margin: 0.5rem 0;">${book.subtitle}</p>
                        <p style="color: var(--text-muted); margin: 1rem 0;">${book.description}</p>
                        <p style="color: var(--text-muted);">
                            <i class="fas fa-calendar"></i> ${book.year} &nbsp;|&nbsp;
                            <i class="fas fa-file-alt"></i> ${book.pages} pages
                        </p>
                        <p style="margin-top: 2rem; font-size: 0.9rem; color: var(--text-muted);">
                            PDF preview not available. Add a PDF URL in biography_page.json.
                        </p>
                    </div>
                `;
            }

            if (window.innerWidth <= 1024) {
                renderMobileDropdown(booksData);
            }
        };

        // Search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filteredBooks = booksData.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.subtitle.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query)
            );
            renderBooks(filteredBooks);
        });

        // Mobile dropdown toggle
        let dropdownOpen = false;
        const toggleMobileDropdown = () => {
            dropdownOpen = !dropdownOpen;
            mobileDropdown.classList.toggle('open', dropdownOpen);
            panelTitle.classList.toggle('dropdown-active', dropdownOpen);
        };

        const setupMobileBehavior = () => {
            if (window.innerWidth <= 1024) {
                panelTitle.classList.add('clickable');
                panelTitle.onclick = toggleMobileDropdown;
                renderMobileDropdown(booksData);
            } else {
                panelTitle.classList.remove('clickable');
                panelTitle.onclick = null;
                mobileDropdown.classList.remove('open');
            }
        };

        const openPanel = () => {
            panel.classList.add('active');
            document.body.style.overflow = 'hidden';
            setupMobileBehavior();
        };

        const closePanel = () => {
            panel.classList.remove('active');
            document.body.style.overflow = '';
        };

        openBtn.addEventListener('click', openPanel);
        closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('active')) {
                closePanel();
            }
        });

        window.addEventListener('resize', setupMobileBehavior);

        // Initial render
        renderBooks(filteredBooks);
    }

    // =============================================
    // PODCAST (DYNAMIC LTS INTEGRATION)
    // =============================================
    async function initPodcast(staticPodcastData) {
        const podcastTitleEl = document.getElementById('podcastTitle');
        const podcastDescEl = document.getElementById('podcastDescription');
        const spotifyLink = document.getElementById('podcastSpotifyLink');
        const appleLink = document.getElementById('podcastAppleLink');
        const episodesContainer = document.getElementById('podcastEpisodes');

        if (staticPodcastData) {
            if (podcastTitleEl) podcastTitleEl.textContent = staticPodcastData.title;
            if (podcastDescEl) podcastDescEl.textContent = staticPodcastData.description;
            if (spotifyLink && staticPodcastData.spotifyUrl) spotifyLink.href = staticPodcastData.spotifyUrl;
            if (appleLink && staticPodcastData.applePodcastsUrl) appleLink.href = staticPodcastData.applePodcastsUrl;
        }

        try {
            // Fetch live data from LTS
            const ltsResponse = await fetch('../data/lts_podcasts.json');
            const ltsPodcasts = await ltsResponse.json();

            // Combine with static episodes if desired, or prioritize LTS
            // For this enhancement, we prioritize showing LTS sessions as the main episodes
            renderLTSSessions(ltsPodcasts, episodesContainer);
        } catch (err) {
            console.warn('Could not fetch LTS data, falling back to static episodes:', err);
            if (staticPodcastData && staticPodcastData.episodes) {
                renderStaticEpisodes(staticPodcastData.episodes, episodesContainer);
            }
        }
    }

    function renderLTSSessions(sessions, container) {
        if (!container || !sessions || sessions.length === 0) return;

        container.innerHTML = sessions.map((session, index) => {
            let statusBadge = '';
            let actionBtn = '';
            const status = session.status.toLowerCase();

            if (status === 'live') {
                statusBadge = `<span class="badge badge-live"><span class="pulse"></span> LIVE</span>`;
                actionBtn = `<a href="../lts/lts-join.html?id=${session.id}" class="ep-btn ep-btn-live">Join Now & Connect <i class="fas fa-heart"></i></a>`;
            } else if (status === 'upcoming') {
                statusBadge = `<span class="badge badge-upcoming">UPCOMING</span>`;
                actionBtn = `<a href="../lts/lts-join.html?id=${session.id}" class="ep-btn">Register Interest</a>`;
            } else {
                statusBadge = `<span class="badge badge-ended">ENDED</span>`;
                actionBtn = `<span class="ep-btn disabled">Session Ended</span>`;
            }

            return `
                <div class="podcast-episode fade-in-up delay-${200 + index * 100}">
                    <div class="episode-header">
                        <div class="episode-icon">
                            <i class="fas ${status === 'live' ? 'fa-signal' : 'fa-microphone-alt'}"></i>
                        </div>
                        <div class="episode-meta">
                            <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom: 0.3rem;">
                                <h4 class="episode-title" style="margin:0;">${session.title}</h4>
                                ${statusBadge}
                            </div>
                            <span class="episode-info">
                                <i class="fas fa-calendar-alt"></i> ${session.date}
                                &nbsp;·&nbsp;
                                <i class="fas fa-clock"></i> ${session.time}
                            </span>
                        </div>
                    </div>
                    <p class="episode-description">${session.description}</p>
                    <div class="episode-footer" style="margin-top: 1.2rem;">
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');

        addBadgeStyles();
        if (window.observeNewCards) window.observeNewCards();
    }

    function renderStaticEpisodes(episodes, container) {
        container.innerHTML = episodes.map((ep, index) => `
            <div class="podcast-episode fade-in-up delay-${200 + index * 100}">
                <div class="episode-header">
                    <div class="episode-icon"><i class="fas fa-play-circle"></i></div>
                    <div class="episode-meta">
                        <h4 class="episode-title">${ep.title}</h4>
                        <span class="episode-info">
                            <i class="fas fa-clock"></i> ${ep.duration} &nbsp;·&nbsp;
                            <i class="fas fa-calendar-alt"></i> ${ep.date}
                        </span>
                    </div>
                </div>
                <p class="episode-description">${ep.description}</p>
            </div>
        `).join('');
    }

    function addBadgeStyles() {
        if (document.getElementById('lts-badge-styles')) return;
        const style = document.createElement('style');
        style.id = 'lts-badge-styles';
        style.textContent = `
            .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
            .badge-live { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
            .badge-upcoming { background: rgba(99, 102, 241, 0.15); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.3); }
            .badge-ended { background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid var(--border); }
            .pulse { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display: inline-block; animation: badgePulse 1.5s infinite; }
            @keyframes badgePulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
            .ep-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease; text-decoration: none; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border); }
            .ep-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--primary); transform: translateY(-2px); }
            .ep-btn-live { background: var(--primary); color: white; border: none; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
            .ep-btn-live:hover { background: var(--accent); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6); }
            .ep-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        `;
        document.head.appendChild(style);
    }
});
