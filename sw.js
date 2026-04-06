const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `ar-portfolio-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
    '/',
    '/offline.html',
    '/frontend/css/styles.css',
    '/frontend/logic/script_v105.js',
    '/frontend/logic/biography_library.js',
    '/manifest.json',
    '/images/arlogo.png',
    '/frontend/data/config.json',
    '/frontend/data/projects_page.json',
    '/frontend/data/socials_page.json',
    '/frontend/data/winnings_page.json',
    '/frontend/data/asked_questions_page.json',
    '/frontend/data/popup_index.json',
    '/frontend/data/blogs.json',
    '/frontend/logic/blog_library.js',
    '/frontend/blogs/blog-index.html',
    '/frontend/lts/lts-index.html',
    '/frontend/lts/lts-join.html',
    '/frontend/lts/lts-room.html'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[Service Worker] Caching failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone the response
                const responseToCache = response.clone();

                // Cache the fetched response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If not in cache and it's a navigation request, show offline page
                    if (request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }

                    return new Response('Network error happened', {
                        status: 408,
                        headers: { 'Content-Type': 'text/plain' },
                    });
                });
            })
    );
});
