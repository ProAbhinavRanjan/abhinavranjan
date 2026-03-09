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
    // PODCAST
    // =============================================
    function initPodcast(podcast) {
        if (!podcast) return;

        // Update podcast header info
        const podcastTitleEl = document.getElementById('podcastTitle');
        const podcastDescEl = document.getElementById('podcastDescription');
        const spotifyLink = document.getElementById('podcastSpotifyLink');
        const appleLink = document.getElementById('podcastAppleLink');

        if (podcastTitleEl) podcastTitleEl.textContent = podcast.title;
        if (podcastDescEl) podcastDescEl.textContent = podcast.description;
        if (spotifyLink && podcast.spotifyUrl) spotifyLink.href = podcast.spotifyUrl;
        if (appleLink && podcast.applePodcastsUrl) appleLink.href = podcast.applePodcastsUrl;

        // Render episodes
        const episodesContainer = document.getElementById('podcastEpisodes');
        if (!episodesContainer || !podcast.episodes || podcast.episodes.length === 0) return;

        episodesContainer.innerHTML = podcast.episodes.map((ep, index) => `
            <div class="podcast-episode fade-in-up delay-${200 + index * 100}">
                <div class="episode-header">
                    <div class="episode-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="episode-meta">
                        <h4 class="episode-title">${ep.title}</h4>
                        <span class="episode-info">
                            <i class="fas fa-clock"></i> ${ep.duration}
                            &nbsp;·&nbsp;
                            <i class="fas fa-calendar-alt"></i> ${ep.date}
                        </span>
                    </div>
                </div>
                <p class="episode-description">${ep.description}</p>
                ${ep.audioUrl && ep.audioUrl !== '#'
                ? `<audio controls class="custom-audio-player"><source src="${ep.audioUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio>`
                : `<p class="episode-coming-soon"><i class="fas fa-microphone-slash"></i> Audio coming soon</p>`
            }
            </div>
        `).join('');

        // Observe new elements for fade-in animation
        if (window.observeNewCards) window.observeNewCards();
    }
});
